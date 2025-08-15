use websiteCompiler::components::*;
use std::fs::{self, File, write, remove_file, create_dir_all, read_to_string, remove_dir_all, OpenOptions};
use std::io::{Write, Result};
use std::path::{Path, PathBuf};
use std::thread;
use std::time::{Duration, SystemTime};
use tempfile::TempDir;
use std::env;

// A helper function to create a unique temporary directory for each test run.
fn setup_test_dir() -> PathBuf {
    let temp_dir = std::env::temp_dir().join(format!(
        "test-{}-{}",
        std::process::id(),
        SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    fs::create_dir_all(&temp_dir).unwrap();
    temp_dir
}

/////////////////////

#[test]
fn test_read_last_compile_time_existing_file() {
    let test_file: &str = "test_compile_time.txt";

    // Ensure the file is created and write the expected value
    write(test_file, "1627890000").unwrap();

    // Read the value from the file
    let result: u64 = read_last_compile_time(test_file);
    
    // Check if the read value matches the expected value
    assert_eq!(result, 1627890000);

    // Clean up by removing the file after the test
    remove_file(test_file).unwrap();
}

#[test]
fn test_read_last_compile_time_non_existent_file() {
    let result: u64 = read_last_compile_time("non_existent_file.txt");
    assert_eq!(result, 0);
}

#[test]
fn test_update_last_compile_time() -> Result<()> {
    let test_file: &str = "test_compile_time.txt";
    update_last_compile_time(1627890000, test_file)?;

    let content: String = read_to_string(test_file)?;
    assert_eq!(content.trim(), "1627890000");

    remove_file(test_file)?;
    Ok(())
}

#[test]
fn test_files_in_source_dir() -> Result<()> {
    create_dir_all("edit-me/test-dir")?;
    write("edit-me/test-dir/file1.txt", "test content")?;

    let files: Vec<String> = files_in_source_dir()?;
    assert!(files.iter().any(|f| f.contains("file1.txt")));

    remove_file("edit-me/test-dir/file1.txt")?;
    remove_dir_all("edit-me")?;
    Ok(())
}

#[test]
fn test_only_modify_time_newer_than_last_compile_time() {
    eprintln!("1");
    // 1. Setup
    let test_dir = setup_test_dir();
    let mut all_files = Vec::new();

    // Create some "old" files
    let old_file_1 = test_dir.join("old_file_1.txt");
    File::create(&old_file_1).unwrap();
    all_files.push(old_file_1);

    let old_file_2_to_modify = test_dir.join("old_file_2.txt");
    File::create(&old_file_2_to_modify).unwrap();
    all_files.push(old_file_2_to_modify.clone());

    // Wait a moment to ensure modification times are distinct
    thread::sleep(Duration::from_millis(10));

    eprintln!("2");
    // 2. Define the "last compile time" before new changes
    let last_compile_time = SystemTime::now();

    // Wait again so new files are definitely newer
    thread::sleep(Duration::from_millis(10));

    eprintln!("3");
    // 3. Create "new" files and modify an old one
    let new_file_1 = test_dir.join("new_file_1.txt");
    File::create(&new_file_1).unwrap();
    all_files.push(new_file_1.clone());

    let new_file_2 = test_dir.join("new_file_2.txt");
    File::create(&new_file_2).unwrap();
    all_files.push(new_file_2.clone());

    // Modify one of the old files to make it "new"
    let mut file_to_update = OpenOptions::new().write(true).open(&old_file_2_to_modify).unwrap();
    file_to_update.write_all(b"some data").unwrap();
    file_to_update.sync_all().unwrap(); // Ensure the modification is written to disk

    eprintln!("4");
    // 4. Run the function
    let result = only_modify_time_newer_than_last_compile_time(&all_files, last_compile_time).unwrap();

    eprintln!("5");
    // 5. Assert the results are correct
    assert_eq!(result.len(), 3, "Should have found 3 newer files");
    assert!(result.contains(&new_file_1));
    assert!(result.contains(&new_file_2));
    assert!(result.contains(&old_file_2_to_modify)); // This one was modified after the timestamp
    eprintln!("6");

    // Cleanup
    remove_dir_all(test_dir).unwrap();
    eprintln!("7");
}

// === NEW TESTS FOR get_relative_path ===

#[test]
fn test_get_relative_path_deeply_nested() {
    // Path has 5 segments: 'level1', 'level2', 'level3', 'level4', 'file.txt'
    // Expected output count: 5 - 2 = 3
    let path = Path::new("level1/level2/level3/level4/file.txt");
    assert_eq!(get_relative_path(path), "../../../");
}

#[test]
fn test_get_relative_path_medium_nesting() {
    // Path has 3 segments: 'docs', 'guides', 'index.md'
    // Expected output count: 3 - 2 = 1
    let path = Path::new("docs/guides/index.md");
    assert_eq!(get_relative_path(path), "../");
}

#[test]
fn test_get_relative_path_shallow_path() {
    // Path has 2 segments: 'src', 'main.rs'
    // Expected output count: 2 - 2 = 0
    let path = Path::new("src/main.rs");
    assert_eq!(get_relative_path(path), "");
}

#[test]
fn test_get_relative_path_root_file() {
    // Path has 1 segment: 'README.md'
    // Expected output count: 1 - 2 = 0 (saturating)
    let path = Path::new("README.md");
    assert_eq!(get_relative_path(path), "");
}

#[test]
fn test_get_relative_path_with_trailing_slash() {
    // Path has 4 segments: 'a', 'b', 'c', 'd'
    // Expected output count: 4 - 2 = 2
    // The trailing slash creates an empty component, which is correctly ignored by the filter.
    let path = Path::new("a/b/c/d/");
    assert_eq!(get_relative_path(path), "../../");
}

// === REPLACING COMPONENT PLACEHOLDERS ===

#[test]
fn test_replace_root_placeholder_with_relative_path_new() {
    let test_dir = setup_test_dir();
    let deep_dir = test_dir.join("a").join("b").join("c");
    fs::create_dir_all(&deep_dir).unwrap();
    let target_file = deep_dir.join("style.css");

    let file_content = "body { background: url('<root>/images/bg.png'); }";
    fs::write(&target_file, file_content).unwrap();

    replace_root_placeholder_with_relative_path_new("<root>", "<root>", &target_file).unwrap();

    let updated_content = fs::read_to_string(&target_file).unwrap();
    let relative_path_for_test = get_relative_path(&target_file.join("dummy"));
    let expected_content = format!("body {{ background: url('{}images/bg.png'); }}", relative_path_for_test);

    assert_eq!(updated_content, expected_content);

    fs::remove_dir_all(test_dir).unwrap();
}

// === JAVASCRIPT COMPONENTS ===

#[test]
fn test_add_reusable_javascript_components() {
    let test_dir = setup_test_dir();
    let js_file = test_dir.join("app.js");
    let shared_dir = test_dir.join("shared").join("js_libs");
    fs::create_dir_all(&shared_dir).unwrap();

    let component1_path = shared_dir.join("component1.ts");
    fs::write(component1_path, "const x = 1;").unwrap();
    let component2_path = shared_dir.join("component2.ts");
    fs::write(component2_path, "function doIt() { console.log('hello'); }").unwrap();

    let main_js_content = "console.log('start');\n<js-component1>\nconsole.log('middle');\n<js-component2>\nconsole.log('end');";
    fs::write(&js_file, main_js_content).unwrap();

    add_reusable_javascript_components(&js_file, &test_dir, "js_libs", "<js-", ">").unwrap();

    let expected_content = "console.log('start');\nconst x = 1;\nconsole.log('middle');\nfunction doIt() { console.log('hello'); }\nconsole.log('end');";
    let actual_content = fs::read_to_string(js_file).unwrap();
    assert_eq!(actual_content, expected_content);

    fs::remove_dir_all(test_dir).unwrap();
}

// === HTML COMPONENTS ===

#[test]
fn test_replace_html_components_all_scenarios() {
    let output_dir = setup_test_dir();
    let src_dir = setup_test_dir();
    let html_file = output_dir.join("index.html");

    // --- Setup the initial HTML file with the original, complex parameter syntax ---
    let main_html = r#"<html><head><title>Test</title></head><body><r-card title='Welcome!' icon=@template:icon image='star.svg'></body></html>"#;
    fs::write(&html_file, main_html).unwrap();

    // --- Setup all source component files ---

    let card_src_dir = src_dir.join("shared/reusables/card");
    fs::create_dir_all(&card_src_dir).unwrap();
    fs::write(card_src_dir.join("card.html"), r#"<div><h2>{title}</h2>{icon}</div>"#).unwrap();
    fs::write(card_src_dir.join("card.scss"), "/* card.css */").unwrap();


    let icon_src_dir = src_dir.join("shared/reusables/icon");
    fs::create_dir_all(&icon_src_dir).unwrap();
    fs::write(icon_src_dir.join("icon.html"), r#"
        <img src='{image}'>
        "#).unwrap();
    fs::write(icon_src_dir.join("icon.ts"), "/* icon.js */").unwrap();


    // zeroth iteration:
    // -----------------------
    // <r-card title='Welcome!' icon="@template:icon image='star.svg'">
    // -----------------------
    // first iteration:
    // -----------------------
    // <div>
    //      <h2>{title}</h2>
    //      {icon}
    // </div>
    // vvvvvvvvvvvvvv [then it hit the params code, knowing: title='Welcome', icon=<icon template> and image='star.svg']
    // <div>
    //      <h2>Welcome!</h2>
    //      <r-icon>
    // </div>
    // -----------------------
    // Second iteration: It then checks to see if there are any more <r- .. > entries... There are, so it subs in;
    // !!! But it doesn't know what the image is! !!! TODO HOW TO MAKE IT KNOW WHAT THE IMAGE IS???!?!??!?
    // --> need some way of carrying into the next iteration...
    // -----------------------
    // <div>
    //      <h2>Welcome!</h2>
    //      <img src='{image}'>
    // </div>
    // -----------------------
    // It then checks to see if there are any more <r- .. > entries... There are not, so it doesn't continue.

    // --- Run the function ONCE. Its internal `loop` must handle all recursion. ---
    eprintln!("a");
    replace_html_component_placeholders(
        &html_file,
        &src_dir,
        "<r-",
        ">",
        "<root>",
        "@template:",
        "@none",
        "{",
        "}",
    )
    .unwrap();
    eprintln!("b");

    // --- Assert the final state ---
    let final_content = fs::read_to_string(&html_file).unwrap();

    // 1. Check for all required CSS/JS links from all processed components (card and icon).
    assert!(final_content.contains(r#"<link rel="stylesheet" href="<root>/shared/reusables/card/card.css">"#));
    assert!(final_content.contains(r#"<script defer src="<root>/shared/reusables/icon/icon.js">"#));

    // 2. Check for the final, fully resolved HTML.
    let expectedWelcome = r#"<h2>Welcome!</h2>"#;
    let expectedImg=r#"<img src='star.svg'>"#;
    assert!( final_content.contains(expectedWelcome), "Assertion failed: expected content not found. final_content: '{}', expected_body: '{}'", final_content, expectedWelcome);
    assert!( final_content.contains(expectedImg), "Assertion failed: expected content not found. final_content: '{}', expected_body: '{}'", final_content, expectedImg);
    
    // 3. Ensure no component tags are left.
    assert!(!final_content.contains("<r-"));

    fs::remove_dir_all(output_dir).unwrap();
    fs::remove_dir_all(src_dir).unwrap();
}


// ===================================================================
// # === Tests for `split_into_new_component_and_new_other` ===
// ===================================================================

// Test Case 1: A standard, "happy path" scenario.
// This test checks the basic functionality: given a mixed list of file paths,
// it correctly separates the component HTML files from everything else based on the
// provided components directory.
#[test]
fn test_split_basic_scenario() {
    println!("--- Running Test: test_split_basic_scenario ---");

    // e.g. A list of files detected by a file watcher or git changes.
    let all_modified_files = [
        "edit-me/shared/reusables/top-bar/top-bar.html",          // This IS a component
        "edit-me/pages/index/index.html",                        // This is NOT a component
        "edit-me/shared/reusables/bottom-bar/bottom-bar.html",    // This IS a component
        "edit-me/shared/reusables/card/card-README.md",          // NOT a component (it's not a .html file)
        "edit-me/assets/style.css",                              // This is NOT a component
    ].join("\n");

    // e.g. The designated folder where all reusable components are stored.
    let components_dir = "edit-me/shared/reusables";

    // --- EXECUTE THE FUNCTION ---
    let (components, others) = 
        split_into_new_component_and_new_other(&all_modified_files, components_dir);

    // --- VERIFY THE RESULTS ---
    
    // The expected list of files that should be identified as components.
    // Note the trailing newline `\n` which our function adds.
    let expected_components = [
        "edit-me/shared/reusables/top-bar/top-bar.html",
        "edit-me/shared/reusables/bottom-bar/bottom-bar.html",
    ].join("\n") + "\n";
    
    // The expected list of all other files.
    let expected_others = [
        "edit-me/pages/index/index.html",
        "edit-me/shared/reusables/card/card-README.md",
        "edit-me/assets/style.css",
    ].join("\n") + "\n";

    println!("Expected Components:\n{}", expected_components);
    println!("Actual Components:\n{}", components);
    assert_eq!(components, expected_components);

    println!("Expected Others:\n{}", expected_others);
    println!("Actual Others:\n{}", others);
    assert_eq!(others, expected_others);
    println!("--- Test Passed ---\n");
}

// Test Case 2: Edge Case - No component files in the input.
// This ensures that if no files match the component criteria, the components list
// is empty and all files are correctly placed in the "others" list.
#[test]
fn test_split_no_components_modified() {
    println!("--- Running Test: test_split_no_components_modified ---");

    // e.g. A list of changes that only contains page files or assets.
    let all_modified_files = [
        "edit-me/pages/index/index.html",
        "edit-me/assets/style.css",
        "README.md",
    ].join("\n");

    let components_dir = "edit-me/shared/reusables";

    // --- EXECUTE ---
    let (components, others) = 
        split_into_new_component_and_new_other(&all_modified_files, components_dir);

    // --- VERIFY ---
    // The components list should be empty.
    let expected_components = "";
    // The "others" list should contain all the files.
    let expected_others = all_modified_files.to_string() + "\n";
    
    println!("Expected Components: [EMPTY]");
    println!("Actual Components: '{}'", components);
    assert!(components.is_empty());

    println!("Expected Others:\n{}", expected_others);
    println!("Actual Others:\n{}", others);
    assert_eq!(others, expected_others);
    println!("--- Test Passed ---\n");
}


// Test Case 3: Edge Case - Only component files in the input.
// This is the reverse of the previous test. It ensures that if ALL files are
// components, the "others" list is correctly left empty.
#[test]
fn test_split_only_components_modified() {
    println!("--- Running Test: test_split_only_components_modified ---");

    // e.g. A commit that only refactored component files.
    let all_modified_files = [
        "edit-me/shared/reusables/top-bar/top-bar.html",
        "edit-me/shared/reusables/button/button.html",
    ].join("\n");

    let components_dir = "edit-me/shared/reusables";

    // --- EXECUTE ---
    let (components, others) = 
        split_into_new_component_and_new_other(&all_modified_files, components_dir);

    // --- VERIFY ---
    // The components list should contain all the files.
    let expected_components = all_modified_files.to_string() + "\n";
    // The "others" list should be empty.
    let expected_others = "";
    
    println!("Expected Components:\n{}", expected_components);
    println!("Actual Components:\n{}", components);
    assert_eq!(components, expected_components);

    println!("Expected Others: [EMPTY]");
    println!("Actual Others: '{}'", others);
    assert!(others.is_empty());
    println!("--- Test Passed ---\n");
}

// Test Case 4: Edge Case - Empty input string.
// The function should not panic or fail if it receives an empty string. It should
// return two empty strings.
#[test]
fn test_split_empty_input() {
    println!("--- Running Test: test_split_empty_input ---");

    let all_modified_files = "";
    let components_dir = "edit-me/shared/reusables";

    // --- EXECUTE ---
    let (components, others) = 
        split_into_new_component_and_new_other(all_modified_files, components_dir);

    // --- VERIFY ---
    println!("Expected Components: [EMPTY]");
    println!("Actual Components: '{}'", components);
    assert!(components.is_empty());

    println!("Expected Others: [EMPTY]");
    println!("Actual Others: '{}'", others);
    assert!(others.is_empty());
    println!("--- Test Passed ---\n");
}


// ===================================================================
// # === Tests for `get_all_files_that_need_recompiling` ===
// ===================================================================

// --- Helper Structs and Functions for Testing `get_all_files_that_need_recompiling` ---

// A structure to define a file to be created for a test.
struct TestFile<'a> {
    path: &'a str,
    content: &'a str,
}

// Test Harness Function: This is a powerful helper for creating a temporary,
// realistic file/directory structure for our tests to run against.
// It prevents tests from interfering with each other and from leaving messy files
// on the developer's machine.
//
// Returns a tuple:
//   - `TempDir`: A handle to the temporary directory. It's crucial to keep this in scope,
//     as the directory is automatically deleted when this handle is dropped.
//   - `PathBuf`: The root path of the created `source_dir` (e.g., `/tmp/xyz/edit-me`).
fn setup_test_environment(files: &[TestFile]) -> (TempDir, PathBuf) {
    // 1. Create a unique temporary directory for this specific test run.
    let tmp_dir = tempdir().expect("Failed to create temporary directory for test");
    
    // 2. Define our base `source_dir` inside the temporary directory.
    let source_dir = tmp_dir.path().join("edit-me");
    fs::create_dir_all(&source_dir).expect("Failed to create source_dir");

    // 3. Iterate through the provided file definitions and create them on the disk.
    for file in files {
        let full_path = source_dir.join(file.path);
        
        // Create parent directories if they don't exist (e.g., `pages/` or `shared/reusables/`).
        if let some(parent) = full_path.parent() {
            fs::create_dir_all(parent).expect("Failed to create parent directories for test file");
        }
        
        // Write the specified content to the file.
        fs::write(&full_path, file.content)
            .expect(&format!("Failed to write test file: {:?}", full_path));
    }
    
    // 4. Return the directory handle and the path to our `source_dir`.
    (tmp_dir, source_dir)
}

// Test Case 5: Basic dependency check.
// Scenario: `index.html` uses the `top-bar` component. If `top-bar.html` is modified,
// the function should detect that `index.html` also needs to be recompiled.
#[test]
fn test_recompile_basic_dependency() {
    println!("--- Running Test: test_recompile_basic_dependency ---");

    // --- ARRANGE ---
    // 1. Define the file system state for this test.
    let files_to_create = vec![
        TestFile { path: "shared/reusables/top-bar/top-bar.html", content: "<!-- Top Bar HTML -->" },
        TestFile { path: "pages/index.html", content: "<html><body><r-top-bar></body></html>" },
        TestFile { path: "pages/about.html", content: "<html><body><h1>About Us</h1></body></html>" },
    ];
    let (_tmp_dir, source_dir) = setup_test_environment(&files_to_create);
    
    // 2. Define the input for our function.
    // The initially modified file is just the top-bar component.
    let initial_modified_files = source_dir
        .join("shared/reusables/top-bar/top-bar.html")
        .to_string_lossy()
        .to_string();
    
    let components_dir = source_dir.join("shared/reusables");

    // --- ACT ---
    // 3. Execute the function.
    let result = get_all_files_that_need_recompiling(
        &source_dir.to_string_lossy(),
        "<r-",
        ">",
        &initial_modified_files,
        &components_dir.to_string_lossy(),
    );

    // --- ASSERT ---
    // 4. Verify the output.
    // We expect the final list to contain BOTH the original file AND the file that depends on it.
    let mut expected_files = vec![
        initial_modified_files,
        source_dir.join("pages/index.html").to_string_lossy().to_string(),
    ];
    expected_files.sort(); // Sort for a consistent, comparable order.
    let expected_string = expected_files.join("\n");
    
    println!("Initial files:\n{}", &initial_modified_files);
    println!("Expected final list:\n{}", expected_string);
    println!("Actual final list:\n{}", result);

    assert_eq!(result, expected_string);
    println!("--- Test Passed ---\n");
}


// Test Case 6: Cascading dependency check (A -> B -> C).
// Scenario: `contact.html` uses `page-layout`. `page-layout` uses `top-bar`.
// If `top-bar.html` is modified, the function must recursively find all dependents.
// It should identify that `page-layout` needs to be updated, and because `page-layout` changed,
// `contact.html` must ALSO be updated.
#[test]
fn test_recompile_cascading_dependency() {
    println!("--- Running Test: test_recompile_cascading_dependency ---");
    
    // --- ARRANGE ---
    let files_to_create = vec![
        // Level C (the root change)
        TestFile { path: "shared/reusables/top-bar/top-bar.html", content: "<!-- Top Bar HTML -->" },
        // Level B (depends on C)
        TestFile { path: "shared/reusables/page-layout/page-layout.html", content: "<div><r-top-bar></div>" },
        // Level A (depends on B)
        TestFile { path: "pages/contact.html", content: "<html><r-page-layout></html>" },
        // Unrelated file
        TestFile { path: "pages/index.html", content: "<html>...</html>" },
    ];
    let (_tmp_dir, source_dir) = setup_test_environment(&files_to_create);
    
    // The only initially modified file is top-bar.html
    let initial_modified_files = source_dir
        .join("shared/reusables/top-bar/top-bar.html")
        .to_string_lossy()
        .to_string();
        
    let components_dir = source_dir.join("shared/reusables");

    // --- ACT ---
    let result = get_all_files_that_need_recompiling(
        &source_dir.to_string_lossy(),
        "<r-",
        ">",
        &initial_modified_files,
        &components_dir.to_string_lossy(),
    );

    // --- ASSERT ---
    // The final list must include all three files in the dependency chain.
    let mut expected_files = vec![
        source_dir.join("shared/reusables/top-bar/top-bar.html").to_string_lossy().to_string(),
        source_dir.join("shared/reusables/page-layout/page-layout.html").to_string_lossy().to_string(),
        source_dir.join("pages/contact.html").to_string_lossy().to_string(),
    ];
    expected_files.sort();
    let expected_string = expected_files.join("\n");
    
    println!("Initial files:\n{}", &initial_modified_files);
    println!("Expected final list:\n{}", expected_string);
    println!("Actual final list:\n{}", result);
    
    assert_eq!(result, expected_string);
    println!("--- Test Passed ---\n");
}


// Test Case 7: Edge Case - Tag with extra whitespace and arguments.
// The regex should be robust enough to find the component name even if the tag
// is formatted unusually.
#[test]
fn test_recompile_tag_with_extra_whitespace_and_args() {
    println!("--- Running Test: test_recompile_tag_with_extra_whitespace_and_args ---");

    // --- ARRANGE ---
    let files_to_create = vec![
        TestFile { path: "shared/reusables/button/button.html", content: "<!-- button -->" },
        // Note the messy but valid tag format below.
        TestFile { path: "pages/index.html", content: r#"<body><r-  button arg1="value"  ></body>"# },
    ];
    let (_tmp_dir, source_dir) = setup_test_environment(&files_to_create);
    
    let initial_modified_files = source_dir.join("shared/reusables/button/button.html").to_string_lossy().to_string();
    let components_dir = source_dir.join("shared/reusables");

    // --- ACT ---
    let result = get_all_files_that_need_recompiling(
        &source_dir.to_string_lossy(),
        "<r-",
        ">",
        &initial_modified_files,
        &components_dir.to_string_lossy(),
    );

    // --- ASSERT ---
    // Should correctly identify `index.html` as a dependent file.
    let mut expected_files = vec![
        initial_modified_files,
        source_dir.join("pages/index.html").to_string_lossy().to_string(),
    ];
    expected_files.sort();
    let expected_string = expected_files.join("\n");
    
    println!("Expected final list:\n{}", expected_string);
    println!("Actual final list:\n{}", result);
    
    assert_eq!(result, expected_string);
    println!("--- Test Passed ---\n");
}

// Test Case 8: Circular dependency check (A -> B, B -> A).
// A well-behaved function should handle this gracefully and terminate, not enter an infinite loop.
// Our implementation using a HashSet naturally handles this: once a file is in the set,
// it can't be added again, so the loop terminates when no *new* files can be found.
#[test]
fn test_recompile_circular_dependency() {
    println!("--- Running Test: test_recompile_circular_dependency ---");
    
    // --- ARRANGE ---
    let files_to_create = vec![
        // component-a depends on component-b
        TestFile { path: "shared/reusables/component-a/component-a.html", content: "<r-component-b>" },
        // component-b depends on component-a
        TestFile { path: "shared/reusables/component-b/component-b.html", content: "<r-component-a>" },
        // An unrelated file
        TestFile { path: "pages/index.html", content: "..." },
    ];
    let (_tmp_dir, source_dir) = setup_test_environment(&files_to_create);
    
    // Let's say component-a was the one initially modified.
    let initial_modified_files = source_dir.join("shared/reusables/component-a/component-a.html").to_string_lossy().to_string();
    let components_dir = source_dir.join("shared/reusables");

    // --- ACT ---
    let result = get_all_files_that_need_recompiling(
        &source_dir.to_string_lossy(),
        "<r-",
        ">",
        &initial_modified_files,
        &components_dir.to_string_lossy(),
    );

    // --- ASSERT ---
    // The function should detect that B depends on A, add B to the list.
    // On the next loop, it will detect A depends on B, but A is already in the list.
    // The list stops growing, and the loop terminates. The result should contain both A and B.
    let mut expected_files = vec![
        initial_modified_files,
        source_dir.join("shared/reusables/component-b/component-b.html").to_string_lossy().to_string(),
    ];
    expected_files.sort();
    let expected_string = expected_files.join("\n");
    
    println!("Expected final list:\n{}", expected_string);
    println!("Actual final list:\n{}", result);
    
    assert_eq!(result, expected_string);
    println!("--- Test Passed: The function did not enter an infinite loop. ---\n");
}

// ===================================================================
// # === Test Harness for Mocking Command-Line Tools ===
// ===================================================================

/// A helper function to create a mock command-line tool (e.g., `sass`, `tsc`) for testing.
/// This is essential because we don't want our tests to fail if `sass` isn't installed
/// on the machine running the tests. This makes our tests **hermetic** (self-contained).
///
/// # Arguments
/// * `mock_dir` - The temporary directory where the mock executable will be placed.
/// * `command_name` - The name of the command to mock, e.g., "sass" or "tsc".
/// * `script_content` - The shell script code that the mock command will execute.
///
/// # Example Script Content
/// * Success case: `#!/bin/sh\necho "Mock SASS running..." >&2\ntouch "$2"\nexit 0`
///   (This script prints a message, creates the output file, and exits successfully)
/// * Failure case: `#!/bin/sh\necho "Error: SCSS syntax error" >&2\nexit 1`
///   (This script prints an error and exits with a failure code)
fn setup_mock_command(mock_dir: &Path, command_name: &str, script_content: &str) {
    let mock_executable_path = mock_dir.join(command_name);
    fs::write(&mock_executable_path, script_content)
        .expect("Failed to write mock command script");

    // On Unix-like systems (Linux, macOS), we need to make the script executable.
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&mock_executable_path, fs::Permissions::from_mode(0o755))
            .expect("Failed to set mock command as executable");
    }

    // Prepend the mock directory to the system's PATH environment variable for the current process.
    // This ensures that when `Command::new("sass")` is called, our mock script is found and
    // executed instead of the real one.
    let original_path = env::var("PATH").unwrap_or_default();
    let new_path = format!("{}{}{}", mock_dir.display(), env::consts::PATH_SEPARATOR, original_path);
    env::set_var("PATH", new_path);
}

// ===================================================================
// # === Tests for `compile_scss_file` ===
// ===================================================================

// Test Case 1: Happy Path - SCSS compilation succeeds.
// Checks that if the source file exists and the (mock) sass command succeeds,
// the function returns Ok, and the output CSS file is created.
#[test]
fn test_compile_scss_success() {
    println!("\n--- Running Test: test_compile_scss_success ---");
    // --- ARRANGE ---
    // 1. Create a temporary directory for our test files and mocks.
    let tmp = tempdir().unwrap();
    // 2. Define the script for our mock `sass` command that simulates success.
    //    `$1` is the input file, `$2` is the output file in shell scripts.
    let mock_sass_script = format!("#!/bin/sh\n# This is a mock sass command\ntouch \"$2\"\nexit 0");
    setup_mock_command(tmp.path(), "sass", &mock_sass_script);
    
    // 3. Create a dummy source SCSS file. Its content doesn't matter.
    let source_scss_file = tmp.path().join("style.scss");
    let output_css_file = tmp.path().join("dist/style.css");
    fs::write(&source_scss_file, "body { color: blue; }").unwrap();

    // --- ACT ---
    // 4. Run the function we're testing.
    let result = compile_scss_file(
        source_scss_file.to_str().unwrap(),
        output_css_file.to_str().unwrap(),
    );

    // --- ASSERT ---
    // 5. Verify the outcome.
    println!("Function result: {:?}", result);
    assert!(result.is_ok(), "Function should return Ok on success");

    println!("Checking if output file exists: {:?}", &output_css_file);
    assert!(output_css_file.exists(), "Output CSS file should be created by the mock command");
    println!("--- Test Passed ---");
}

// Test Case 2: Failure - Source SCSS file does not exist.
// Checks that the function correctly returns an Err when the input file is missing
// without attempting to run the compiler.
#[test]
fn test_compile_scss_source_not_found() {
    println!("\n--- Running Test: test_compile_scss_source_not_found ---");
    // --- ARRANGE ---
    let tmp = tempdir().unwrap();
    let non_existent_source = tmp.path().join("non_existent.scss");
    let output_css_file = tmp.path().join("dist/style.css");

    // --- ACT ---
    let result = compile_scss_file(
        non_existent_source.to_str().unwrap(),
        output_css_file.to_str().unwrap(),
    );

    // --- ASSERT ---
    println!("Function result: {:?}", result);
    assert!(result.is_err(), "Function should return Err when source is not found");
    assert!(result.unwrap_err().contains("source scss file not found"));
    
    println!("Checking that output file was not created");
    assert!(!output_css_file.exists(), "Output file should not be created if source is missing");
    println!("--- Test Passed ---");
}

// Test Case 3: Failure - `sass` command fails (returns non-zero exit code).
// Checks that the function captures the failure from the external command and reports it.
#[test]
fn test_compile_scss_command_fails() {
    println!("\n--- Running Test: test_compile_scss_command_fails ---");
    // --- ARRANGE ---
    let tmp = tempdir().unwrap();
    // This mock `sass` command simulates a syntax error by exiting with code 1.
    let mock_sass_script = format!("#!/bin/sh\necho \"Error: Invalid CSS after \\\"body...\\\": expected \\\"{{\\\", was \\\"}\\\"\" >&2\nexit 1");
    setup_mock_command(tmp.path(), "sass", &mock_sass_script);
    
    let source_scss_file = tmp.path().join("style.scss");
    let output_css_file = tmp.path().join("dist/style.css");
    fs::write(&source_scss_file, "body { color: blue; }").unwrap();

    // --- ACT ---
    let result = compile_scss_file(
        source_scss_file.to_str().unwrap(),
        output_css_file.to_str().unwrap(),
    );

    // --- ASSERT ---
    println!("Function result: {:?}", result);
    assert!(result.is_err(), "Function should return Err on compilation failure");
    let error_message = result.unwrap_err();
    println!("Error message: {}", error_message);
    assert!(error_message.contains("error compiling scss file"));
    assert!(error_message.contains("Invalid CSS")); // Check that stderr from the mock is captured.

    println!("--- Test Passed ---");
}


// ===================================================================
// # === Tests for `compile_typescript_file` ===
// ===================================================================

// Test Case 4: Happy Path - TypeScript compilation succeeds.
// Checks that on success, the function returns Ok, the JS output is created,
// AND the original TS source file is deleted.
#[test]
fn test_compile_typescript_success() {
    println!("\n--- Running Test: test_compile_typescript_success ---");
    // --- ARRANGE ---
    let tmp = tempdir().unwrap();
    // Mock `tsc` that creates the output file (`--outfile` is the 4th argument)
    let mock_tsc_script = format!("#!/bin/sh\n# This is a mock tsc command\ntouch \"$4\"\nexit 0");
    setup_mock_command(tmp.path(), "tsc", &mock_tsc_script);
    
    let source_ts_file = tmp.path().join("app.ts");
    let output_js_file = tmp.path().join("dist/app.js");
    fs::write(&source_ts_file, "const x: number = 1;").unwrap();

    // --- ACT ---
    let result = compile_typescript_file(
        source_ts_file.to_str().unwrap(),
        output_js_file.to_str().unwrap(),
    );

    // --- ASSERT ---
    println!("Function result: {:?}", result);
    assert!(result.is_ok(), "Function should return Ok on success");

    println!("Checking if output file exists: {:?}", &output_js_file);
    assert!(output_js_file.exists(), "Output JS file should be created");

    println!("Checking if source file was deleted: {:?}", &source_ts_file);
    assert!(!source_ts_file.exists(), "Source TS file should be deleted on success");
    println!("--- Test Passed ---");
}


// Test Case 5: Failure - `tsc` command fails.
// Checks that if the compiler fails, the function returns an Err, and critically,
// the original source file is NOT deleted.
#[test]
fn test_compile_typescript_command_fails() {
    println!("\n--- Running Test: test_compile_typescript_command_fails ---");
    // --- ARRANGE ---
    let tmp = tempdir().unwrap();
    // Mock `tsc` that simulates a type error and exits with code 1.
    let mock_tsc_script = format!("#!/bin/sh\necho \"app.ts(1,7): error TS2322: Type 'string' is not assignable to type 'number'.\" >&2\nexit 1");
    setup_mock_command(tmp.path(), "tsc", &mock_tsc_script);
    
    let source_ts_file = tmp.path().join("app.ts");
    let output_js_file = tmp.path().join("dist/app.js");
    fs::write(&source_ts_file, "const x: number = 'hello';").unwrap();
    
    // --- ACT ---
    let result = compile_typescript_file(
        source_ts_file.to_str().unwrap(),
        output_js_file.to_str().unwrap(),
    );

    // --- ASSERT ---
    println!("Function result: {:?}", result);
    assert!(result.is_err(), "Function should return Err on compilation failure");

    println!("Checking if source file STILL exists: {:?}", &source_ts_file);
    assert!(source_ts_file.exists(), "Source TS file should NOT be deleted on failure");
    
    println!("Checking that output file was NOT created");
    assert!(!output_js_file.exists(), "Output JS file should not be created on failure");
    println!("--- Test Passed ---");
}
