# todo:
- start with fixing the tests
    - just run the tests, fix what goes wrong
- then run the main code
    - will need to work out oddities with file paths etc. which will probs be a mega headache
    - just have the original code ready, and be ready.

# To run:
cargo build
cargo run



# reference for me on running the server
NOT!!!!!!!!!!! webfsd -F -p 8080 -r "$PWD" -i index.html
python3 -m http.server 8000
sudo lsof -i :8000

