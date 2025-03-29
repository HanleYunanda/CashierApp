const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}

module.exports = {
    deleteFile
}