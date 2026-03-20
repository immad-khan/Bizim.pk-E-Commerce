---
description: Push all changes to GitHub after every modification
---

// turbo-all

After making ANY change to the codebase, always execute the following steps to commit and push the changes to GitHub (https://github.com/immad-khan/Bizim.pk-E-Commerce):

1. Stage all changed files:
```
git -C "d:\Desktop\Bizim.pk" add -A
```

2. Commit with a descriptive message summarizing what was changed:
```
git -C "d:\Desktop\Bizim.pk" commit -m "<short, descriptive summary of the changes made>"
```

3. Push to the remote GitHub repository:
```
git -C "d:\Desktop\Bizim.pk" push origin main
```

> **Note:** If `main` is not the default branch, use `master` or the correct branch name instead.
> Always use a meaningful commit message that describes what was changed and why.
