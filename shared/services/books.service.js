const dbDriver = require('./sqlite.driver.service')

function getAllBooks() {
    return dbDriver.selectAllBooks();
}

function getAllAuthors() {
    return dbDriver.selectAllBooks();
}

function getAllPublishers() {
    return dbDriver.selectAllBooks();
}

module.exports = {
    getAllBooks
}
