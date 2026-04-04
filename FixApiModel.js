const fs = require('fs');

let model = fs.readFileSync('api/Models/Product.cs', 'utf8');

if(!model.includes('ShipmentFee')) {
    model = model.replace('public int Quantity { get; set; } = 0;', 'public int Quantity { get; set; } = 0;\n        public decimal ShipmentFee { get; set; } = 0;');
    fs.writeFileSync('api/Models/Product.cs', model, 'utf8');
    console.log('Added ShipmentFee to API Model');
} else {
    console.log('ShipmentFee already in API Model');
}
