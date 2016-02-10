String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

var TRANSLATE = {
  ru: {
    destroy: 'Вы действительно хотите удалить параметр?',
    year: "Введите год:",
  },
  en: {
    destroy: 'Are you sure you want to delete option?',
    year: "Enter year:",
  }
};