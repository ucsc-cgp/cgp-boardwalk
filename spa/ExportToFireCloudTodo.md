1. Fix ugly hack in cc-base.dao.ts where added getNoCatch method; but otherwise I don't get the error.
2. CORS errors provides no details.
3. `FilesService.exportToFireCloud` returns a string for success and error, then there is an ugly hardcoded test in
file.effects.ts to see if the string starts with `Error`.
4. In file.dao.ts, construct FireCloud url from response.