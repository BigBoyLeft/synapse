git ls-files -c --ignored --exclude-standard -z | xargs -0 git rm --cached
git commit -am "refactor(gitignore)!: .gitignore Update"