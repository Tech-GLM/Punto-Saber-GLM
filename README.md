# Punto

A Spanish practice platform built from the supplied `Pruebas de Estado.zip` archive.

## Contents

- 60 interactive questions from the 2005-1 booklets, checked against the included `respuestas.xls` workbook.
- Five study areas: Mathematics (10), Reading and language (11), Natural sciences (19), Social studies and history (10), English (10).
- Guided practice with feedback, configurable timed simulations, full answer review, bookmarks, browser-local progress, JSON progress import/export, and CSV results.
- A searchable library of all 106 supplied PDFs from 2003–2010. Original source files are retained under `archive/`.
- Responsive keyboard-accessible interface; practice question selection supports number keys 1–4.

The subject grouping is for study and does not claim to reproduce the current exam. Results are raw practice percentages, not scaled official scores. Explanations are independently written instructional notes, not official ICFES explanations. Questions have minor screen-reading adaptations; each includes a link and page reference to its original. Question 16 of mathematics was withdrawn in the source and is excluded. Mathematics questions 21–24 accept both alternatives explicitly listed in the historical key. Mathematics 15 and Language 8 remain excluded pending formulation/key review.

## Run and maintain

The site is static: the repository root is the deployment root. It has no external font, JavaScript or CSS dependency and no server database. User progress stays in `localStorage`; it is not shared across students, devices or browsers. Export/import provides manual transfer.

Run checks with `node --test tests/*.test.mjs`. The flow tests execute application handlers with a minimal DOM adapter and do not replace visual browser testing. Visual browser QA remains pending.

To rebuild the supplied bank and source catalog, run `python scripts/prepare_bank.py '/path/to/Pruebas de Estado.zip'`. It requires `xlrd` for the historical answer workbook. Question records and explanations are maintained in that script, and the generated static content is `bank.json`. When adding questions, verify their source, accepted answer(s), formatting, numbering, and permissions for the intended audience.

Published for Tech-GLM with GitHub Pages. In repository Settings → Pages, choose “Deploy from a branch”, branch `main`, folder `/ (root)`. The `.nojekyll` file enables direct static publishing. No build step or external dependencies are needed for the website. To edit the question selection, update `scripts/prepare_bank.py` and rebuild from the original archive.
