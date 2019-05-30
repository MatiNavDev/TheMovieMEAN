/**
 * Obtiene la ultima pagina de elementos
 * @param {Number} itemsAmount
 * @param {Number} amountPerPage
 */
function getLastPage(itemsAmount, amountPerPage) {
  const leftover = itemsAmount % amountPerPage;
  const integerPart = Math.floor(itemsAmount / amountPerPage);
  const lastPage = leftover ? integerPart + 1 : integerPart;

  return lastPage;
}

module.exports = {
  getLastPage
};
