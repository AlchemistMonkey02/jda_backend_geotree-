const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
    plantId: {
        type: String, // from CSV first column
        required: true,
        unique: true
    },
    scientificName: {
        type: String
    },
    englishName: {
        type: String
    },
    hindiName: {
        type: String
    },
    category: {
        type: String,
        enum: ['Medicinal', 'Religious', 'Shade', 'Fruit', 'Ornamental', 'Timber', 'Commercial', 'Decorative', 'Exotic', 'Other'],
        default: 'Other'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);
