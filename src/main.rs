use std::process::{Command, exit};
use clap::{Arg, Command as ClapCommand};
use anyhow::{anyhow, Context, Result};
use regex::Regex;
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use std::time::SystemTime;

use websiteCompiler::components::*;

// Global definitions
// --> main directories / filenames
const OUTPUT_DIRECTORY: &str = "actual-website-do-not-edit";
const SOURCE_DIR: &str = "edit-me";
const SHARED_CODE_FOLDER: &str = "code";
const LAST_COMPILE_TIME_FILE: &str = ".last_compiled";
const COMPONENTS_DIR: &str = "edit-me/shared/reusables";

// --> Placeholders
const ROOT_PLACEHOLDER: &str = "<root>";
const SCSS_IMPORT_START: &str = "@use";
const HTML_COMPONENT_TEMPLATE_PREFIX: &str = "@template:";
const HTML_COMPONENT_NONE_PREFIX: &str = "@none:";
const RE_START: &str = "<r-"; // start of reusable html component placeholders
const RE_END: &str = ">";
const RE_PARAM_S: &str = "{"; // start of reusable html components parameter placeholders
const RE_PARAM_E: &str = "}"; // end of reusable html components parameter placeholders

// --> Placeholders (restricted to be unique)
const NEWLINE_PLACEHOLDER: char = '§';
const TOP_COMMENT: &str = "# [@reusable_component_start]:"; // placeholder to represent the start of a reusable component
const BOTTOM_COMMENT: &str = "# [@reusable_component_end]:"; // placeholder to represent the end of a reusable component

// --> Debug flags
// (These would be used as needed in your actual implementation)

fn main() {
    let matches = ClapCommand::new("website-compiler")
        .version("1.0")
        .about("Website compiler with reusable components")
        .arg(
            Arg::new("fresh")
                .short('f')
                .long("fresh")
                .action(clap::ArgAction::SetTrue)
                .help("Fresh compile; delete the existing output directory contents and compile everything from scratch")
        )
        .arg(
            Arg::new("github-pages")
                .long("github-pages")
                .action(clap::ArgAction::SetTrue)
                .help("Compile with GitHub Pages option")
        )
        .get_matches();

    // Get the options passed
    let github_pages = matches.get_flag("github-pages");
    let fresh_run = matches.get_flag("fresh");

    println!("----------------------------------------------------------------------------------------------------------");
    println!(" --ENSURING REQUIRED THINGS EXIST --");
    println!("----------------------------------------------------------------------------------------------------------");

    // Check for required dependencies
    check_command_exists("sass", "Sass is not installed. Please install Sass to compile .scss files. (https://sass-lang.com/install/)");

    // Your main compilation logic would go here
    // For now, just showing the structure with the flags
    println!("GitHub Pages mode: {}", github_pages);
    println!("Fresh run mode: {}", fresh_run);
    
    // MAIN CODE
    if let Err(e) = run_build_process(fresh_run, github_pages) {
        eprintln!("\n❌ Build failed: {}", e);
        // Add context for chained errors
        let mut cause = e.source();
        while let Some(source) = cause {
            eprintln!("    Caused by: {}", source);
            cause = source.source();
        }
        exit(1);
    }
}

// ========================================================================================================
// -- PREPPING LOCAL FUNCTIONS --
// ========================================================================================================

/// The main entry point for the build process. Orchestrates finding, preparing,
/// and compiling all necessary files.
fn run_build_process(fresh_run: bool, github_pages: bool) -> Result<()> {
    println!("----------------------------------------------------------------------------------------------------------");
    println!(" -- RUNNING LOGIC --");
    println!("----------------------------------------------------------------------------------------------------------");

    let last_compile_time:u64 = if fresh_run {
        println!("RUNNING WITH FRESH RUN!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // clear existing output dir
        if Path::new(OUTPUT_DIRECTORY).exists() {
            fs::remove_dir_all(OUTPUT_DIRECTORY)?;
        }
        fs::create_dir_all(OUTPUT_DIRECTORY)?;
        // reset last compile time
        0
    } else {
        read_last_compile_time(LAST_COMPILE_TIME_FILE)
    };

    let all_files = files_in_source_dir(SOURCE_DIR)?;
    let newly_modified_files = only_modify_time_newer_than_last_compile_time(&all_files, last_compile_time)?;

    let newly_modified_files_str: String = newly_modified_files.iter().map(|p| p.to_string_lossy()).collect::<Vec<_>>().join("\n");
    
    let all_files_that_are_to_be_compiled_str = get_all_files_that_need_recompiling( SOURCE_DIR, RE_START, RE_END, &newly_modified_files_str, COMPONENTS_DIR);
    
    println!("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    println!("{}", &all_files_that_are_to_be_compiled_str);

    // (0); Load the prioritized components list
    let components_list = load_components_list()?;
    
    // (2) split the newly_modified_files into newly_modified_components and newly_modified_pages_etc
    println!("\n()()()()()()()()()()()() splitting components ()()()()()()()()()()()()");

    let (new_components_that_need_compiling, new_everything_else_that_needs_compiling) = split_into_new_component_and_new_other( &all_files_that_are_to_be_compiled_str, "edit-me/shared",);

    println!("()()()()()()()()()()()() After splitting Components ()()()()()()()()()()()()");
    println!("Components:\n{}", &new_components_that_need_compiling);
    println!("Others:\n{}", &new_everything_else_that_needs_compiling);
    println!("()()()()()()()()()()()() DONE ()()()()()()()()()()()()");

    // (3) Compiles the components, in the order they should be compiled in.
    println!("\n<><><><><><><><><><><><> COMPILING THE *PRIORITIZED* REUSABLE COMPONENTS IN ORDER <><><><><><><><><><><><>");
    println!("as a reminder, the list of new components:\n{}", &new_components_that_need_compiling);
    // ---------------------
    let mut compiled_components = HashSet::new();
    let mut all_ts_files = Vec::new();
    let mut all_scss_files = Vec::new();

    // a. Iterate through components in order of priority
    for component_name in &components_list {
        let component_path_in_src_dir = Path::new(COMPONENTS_DIR).join(component_name).join(format!("{}.html", component_name));
        let component_path_str = component_path_in_src_dir.to_string_lossy();

        println!("....................checking whether the following path is in the list of new components that need compiling: {}", &component_path_str);

        // Check if it's in the list of new components by seeing if the string contains it as a whole line
        if new_components_that_need_compiling.lines().any(|line| line == component_path_str) {
            println!("\t~~~~~~~");
            println!("\tCompiling (prioritized): {}", &component_path_str);
            println!("\t~~~~~~~");
            let (ts_files, scss_files) = compile_all(&component_path_str)?;
            all_ts_files.extend(ts_files);
            all_scss_files.extend(scss_files);
            compiled_components.insert(component_path_str.to_string());
        }
    }

    // b. Compile any remaining components that weren't in the priority list (i.e. any of the standard pages // things not in the shared directory)
    let mut unprioritized_to_compile = String::new();
    for component_path in new_components_that_need_compiling.lines() {
        if component_path.is_empty() { continue; }
        if !compiled_components.contains(component_path) {
            println!("Compiling (unprioritized NOT IN THE COMPILED COMPONENTS LIST): {}", component_path);
            unprioritized_to_compile.push_str(component_path);
            unprioritized_to_compile.push('\n');
        } else {
            println!("already compiled: {} skipping...", component_path);
        }
    }
    if !unprioritized_to_compile.is_empty() {
        let (ts_files, scss_files) = compile_all(&unprioritized_to_compile)?;
        all_ts_files.extend(ts_files);
        all_scss_files.extend(scss_files);
    }
    // ---------------------
    println!("<><><><><><><><><><><><> DONE <><><><><><><><><><><><>");
    println!("\n<><><><><><><><><><><><> COMPILING THE REGULAR COMPONENTS IN ORDER <><><><><><><><><><><><>");

    // (4) run compile All on the newly_modified_pages
    let (ts_files, scss_files) = compile_all(&new_everything_else_that_needs_compiling)?;
    all_ts_files.extend(ts_files);
    all_scss_files.extend(scss_files);

    // ----------------------------------------------------------------------------------------
    // --- Final Compilation Step ---
    // ----------------------------------------------------------------------------------------
    let mut successful_scss_compilations = 0;
    for css_file in &all_scss_files {
        let scss_source = css_file.with_extension("scss");
        if compile_scss_file(scss_source.to_str().unwrap(), css_file.to_str().unwrap()).is_ok() {
            successful_scss_compilations += 1;
        }
    }
    println!("{} of {} SCSS file(s) compiled to CSS.", successful_scss_compilations, all_scss_files.len());

    let mut successful_ts_compilations = 0;
    for js_file in &all_ts_files {
        let ts_source = js_file.with_extension("ts");
        if compile_typescript_file(ts_source.to_str().unwrap(), js_file.to_str().unwrap()).is_ok() {
            successful_ts_compilations += 1;
        }
    }
    println!("{} of {} TypeScript file(s) compiled to JavaScript.", successful_ts_compilations, all_ts_files.len());
    
    // Clean up .map files created by sass/tsc
    for entry in WalkDir::new(OUTPUT_DIRECTORY).into_iter().filter_map(Result::ok) {
        if entry.path().extension().map_or(false, |e| e == "map") {
            let _ = fs::remove_file(entry.path());
        }
    }

    println!("✅ finished compiling modified files");

    // --- APPLYING GITHUB PAGES COMPILATION OPTIONS ---
    if github_pages {
        println!("----------------------------------------------------------------------------------------------------------");
        println!(" -- APPLYING GITHUB PAGES COMPILATION OPTIONS --");
        println!("----------------------------------------------------------------------------------------------------------");
        let html_files: Vec<_> = WalkDir::new(OUTPUT_DIRECTORY)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| e.path().extension().map_or(false, |ext| ext == "html"))
            .collect();

        for entry in html_files {
            let file_path = entry.path();
            println!("File: {}", file_path.display());
            let mut content = fs::read_to_string(file_path)?;
            // This regex removes `.html` from href attributes, which is safer than a global replace.
            let link_regex = Regex::new(r#"(<a[^>]*\s+href\s*=\s*["'])([^"']*)(\.html)(["'][^>]*>)"#)?;
            content = link_regex.replace_all(&content, r#"$1$2$4"#).to_string();
            fs::write(file_path, content)?;
        }
    }
    
    // Update the last compile time in the hidden file
    update_last_compile_time(SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap_or_default().as_millis() as u64, LAST_COMPILE_TIME_FILE)?;

    println!("done.");
    Ok(())
}

/// Pre-processes a list of source files: copies them to the output directory,
/// injects/replaces placeholders and components, and returns lists of files
/// that require final compilation (TS and SCSS).
/// This is the Rust version of the `compileAll` shell function.
pub fn compile_all(source_files_str: &str) -> Result<(Vec<PathBuf>, Vec<PathBuf>)> {
    let mut modified_ts_files_list = Vec::new();
    let mut modified_scss_files_list = Vec::new();
    let pages_regex = Regex::new(r"pages/[^/]+/")?;

    // Read each file name line by line
    for source_path_str in source_files_str.lines() {
        // e.g. source_path=edit-me/pages/index/index.ts  //  edit-me/shared/reusables/top-bar/top-bar.scss

        // Skip empty lines
        if source_path_str.trim().is_empty() {
            continue;
        }
        let source_path = Path::new(source_path_str);

        // Step 0)a): Generate destination path
        // In Rust, we build this path step-by-step, starting with the path relative to the source dir.
        let path_relative_to_src = source_path
            .strip_prefix(SOURCE_DIR)
            .with_context(|| format!("Error stripping prefix '{}' from '{}'", SOURCE_DIR, source_path.display()))?;

        // 1. Replace pages/.*/. with / (move two levels back if in pages)
        // This solves the E0716 error by ensuring `relative_path_cow` lives long enough.
        let relative_path_cow = path_relative_to_src.to_string_lossy();
        let dest_path_str = pages_regex.replace(&relative_path_cow, ""); // e.g. index.ts // shared/reusables/top-bar/top-bar.scss

        // 3. Add OUTPUT_DIRECTORY prefix
        let path_relative_to_src_dir = Path::new(dest_path_str.as_ref());
        let dest_path_with_swapped_ext = {
            let mut p = path_relative_to_src_dir.as_os_str().to_owned();
            if dest_path_str.ends_with(".ts") {
                p.push(".js");
                PathBuf::from(p.to_string_lossy().replace(".ts.js", ".js"))
            } else if dest_path_str.ends_with(".scss") {
                p.push(".css");
                PathBuf::from(p.to_string_lossy().replace(".scss.css", ".css"))
            } else {
                PathBuf::from(path_relative_to_src_dir)
            }
        };
        let dest_path = Path::new(OUTPUT_DIRECTORY).join(&dest_path_with_swapped_ext);
        println!("dest_path: {}", dest_path.display());


        // Step 0)b): Get uncompiled version of destination path
        let dest_uncompiled = Path::new(OUTPUT_DIRECTORY).join(path_relative_to_src_dir);

        // Add to the appropriate array, used for compilation later on
        if dest_uncompiled.extension().and_then(|s| s.to_str()) == Some("ts") {
            modified_ts_files_list.push(dest_path.clone());
        } else if dest_uncompiled.extension().and_then(|s| s.to_str()) == Some("scss") {
            modified_scss_files_list.push(dest_path.clone());
        }

        println!("-------------------------------------");
		println!("	1)");
        
        // Step 1: Copy across
        // Delete existing compiled file if it exists (copy will overwrite, but this is for faithfulness)
        if dest_path.exists() {
            let _ = fs::remove_file(&dest_path);
        }
        
        // Copy the file
		if let Some(parent) = dest_uncompiled.parent() {
            fs::create_dir_all(parent)
                .with_context(|| format!("Failed to create parent directory for '{}'", dest_uncompiled.display()))?;
        }
        fs::copy(source_path, &dest_uncompiled)
            .with_context(|| format!("Failed to copy '{}' to '{}'", source_path.display(), dest_uncompiled.display()))?;
        
        println!("Successfully copied file {} to its destination: {}", source_path.display(), dest_uncompiled.display());


		println!("-------------------------------------");
		println!("	2)");
		// Step 2) Replace scss import placeholders
        if dest_uncompiled.extension().and_then(|s| s.to_str()) == Some("scss") {
			println!("2222222! Is an scss file!");
			replace_root_placeholder_with_relative_path_new(SCSS_IMPORT_START, ROOT_PLACEHOLDER, &dest_uncompiled)?;
		}

		println!("-------------------------------------");
		println!("	3)");
		// Step 3) Add reusable components to javascript files
        if dest_uncompiled.extension().and_then(|s| s.to_str()) == Some("ts") {
			println!("33333333! Is a ts file!");
			add_reusable_javascript_components(&dest_uncompiled, Path::new(OUTPUT_DIRECTORY), SHARED_CODE_FOLDER, RE_START, RE_END)?;
		}

		println!("-------------------------------------");
		println!("	4)");
		// Step 4) Add reusable components to html files
        if dest_uncompiled.extension().and_then(|s| s.to_str()) == Some("html") {
			println!("4! Is a html file!");
            replace_html_component_placeholders(
                &dest_uncompiled,
                Path::new(SOURCE_DIR),
                RE_START,
                RE_END,
                ROOT_PLACEHOLDER,
                HTML_COMPONENT_TEMPLATE_PREFIX,
                HTML_COMPONENT_NONE_PREFIX,
                RE_PARAM_S,
                RE_PARAM_E,
            )?;
		}

		println!("-------------------------------------");
		println!("	5)");
		// Step 5) Replace <root> placeholders with the relative path to root
		// i.e. change <root>/shared/example.html in the file /pages/index.html to ../example.html
		replace_root_placeholder_with_relative_path_new(ROOT_PLACEHOLDER, ROOT_PLACEHOLDER, &dest_uncompiled)?;
    }

    Ok((modified_ts_files_list, modified_scss_files_list))
}



fn check_command_exists(command: &str, error_message: &str) {
    match Command::new("which").arg(command).output() {
        Ok(output) => {
            if !output.status.success() {
                eprintln!("{}", error_message);
                exit(1);
            }
        }
        Err(_) => {
            // Fallback: try to run the command directly
            match Command::new(command)
                .arg("--version")
                .output()
            {
                Ok(_) => {
                    // Command exists
                }
                Err(_) => {
                    eprintln!("{}", error_message);
                    exit(1);
                }
            }
        }
    }
}


/// Loads and validates the prioritized list of components from the compilation order file.
fn load_components_list() -> Result<Vec<String>> {
    let order_file_path = Path::new(COMPONENTS_DIR).join("reusables-compilation-order.txt");
    println!("><><><><><><><><><><>< loading the ordered components list from {} ><><><><><><><><><><><", order_file_path.display());

    if !order_file_path.is_file() {
        return Err(anyhow!("Error: Compilation order file not found at: {}", order_file_path.display()));
    }

    // Get valid directory names in components_dir (basename only)
    let valid_dirs: HashSet<String> = WalkDir::new(COMPONENTS_DIR).min_depth(1).max_depth(1).into_iter().filter_map(Result::ok).filter(|e| e.file_type().is_dir()).map(|e| e.file_name().to_string_lossy().into_owned()).collect();

    // Read file, clean lines, and validate
    let file_content = fs::read_to_string(&order_file_path)?;
    let mut components_list = Vec::new();
    for line in file_content.lines() {
        let trimmed_line = line.trim();

        // Skip empty lines and comments
        if trimmed_line.is_empty() || trimmed_line.starts_with('#') {
            continue;
        }

        // Check if it's a valid directory
        if valid_dirs.contains(trimmed_line) {
            components_list.push(trimmed_line.to_string());
        } else {
            eprintln!("Valid component directories are: {:?}", valid_dirs);
            return Err(anyhow!("Error: Invalid component name in order file: \"{}\"", trimmed_line));
        }
    }
    
    println!("Validated components list:\n{:?}", &components_list);
    println!("><><><><><><><><><><>< done ><><><><><><><><><><><");
    Ok(components_list)
}
