// catch bloğu her metot için aynı olduğundan bu şekilde generic response fonksiyonu kullanarak kod tekrarını önlemiş olduk.
const response = async (res, callback) => {
    try {
        callback(); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = response;