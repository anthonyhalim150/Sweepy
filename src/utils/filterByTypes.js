/**
 * Filters the result object by the given type(s).
 * @param {{ unusedJS: string[], unusedCSS: string[], unusedAssets: string[] }} result
 * @param {string[]} types
 */
export function filterByTypes(result, types) {
    const filtered = {
      unusedJS: types.includes('js') ? result.unusedJS : [],
      unusedCSS: types.includes('css') ? result.unusedCSS : [],
      unusedAssets: types.includes('assets') ? result.unusedAssets : []
    };
    return filtered;
  }
  