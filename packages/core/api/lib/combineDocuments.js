// Reuse the same join logis as client util.
export const combineDocuments = (docs) => 
    docs.map( d => d.pageCOntent).join('\n\n');