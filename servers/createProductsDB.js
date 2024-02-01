const sqlite3 = require('sqlite3').verbose();

// Dummy data for products
class Product {
    constructor(name, imageUrl, description, productType, manufacturedDate, price, manufacturer, country) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.productType = productType; // Electric, Wooden, Fabric
        this.manufacturedDate = manufacturedDate; // Dummy expiration date
        this.price = price; // Dummy price
        this.manufacturer = manufacturer; // Dummy manufacturer
        this.country = country; // Dummy country
    }
}

const allProducts = [
    // Electric Products
    new Product("Panasonic Rice Cooker", "images/goods/electric/image01.jpg", "Include Extended Warranty Plus (2 Years)", "Electric", "2023-03-31", "$100", "Panasonic", "USA"),
    new Product("MSI Modern 14 C7M Laptop"   , "images/goods/electric/image02.jpg", "Processor: Ryzen 5, Ram: 16GB", "Electric", "2023-01-31", "$1000", "MSI", "Canada"),
    new Product("Top Loader Washing Machine", "images/goods/electric/image03.jpg", "Special Features	Eco Bubble / BubbleStorm™ / Speed Spray™", "Electric", "2021-10-30", "$120", "Samsung", "UK"),
    new Product("Mixer Grinder", "images/goods/electric/image04.jpg", "Jar Capacity	1.5 LITRE JAR CAPACITY", "Electric", "2020-02-28", "$200", "Regnis", "Australia"),
    new Product("Built-In Oven", "images/goods/electric/image05.jpg", "deep baking tray, shallow baking tray,Grill Gate", "Electric", "2022-09-20", "$900", "Hafele", "USA"),

    // Wooden Products
    new Product("Budget Stool", "images/goods/wooden/image01.jpg", "Wipe clean using a damp cloth and a mild cleaner, wipe dry with a clean cloth", "Wooden", "2021-12-31", "$50", "Artisan Furnishings", "USA"),
    new Product("Cascade Console Table", "images/goods/wooden/image02.jpg", "	2 Drawer & steel rectangular bar frame with console unit", "Wooden", "2022-11-15", "$220", "Abans", "Sri Lanka"),
    new Product("Jane Center Table", "images/goods/wooden/image03.jpg", "Glass Top with Square Wooden frame", "Wooden", "2020-10-30", "$180", "RusticWoods Inc", "UK"),
    new Product("Regal Dining Set", "images/goods/wooden/image04.jpg", "Treated Rubber Wood, PU Cushion, Fabric,", "Wooden", "2019-02-28", "$300", "FineWood Creations", "Australia"),

    // Fabric Products
    new Product("ATHLETE DRY FIT T SHIRT", "images/goods/fabric/image01.jpg", "When your workout heats up, you'll want something to cool you down. Embrace the extremes in the Trafford Dry fit tee.", "Fabric", "2018-12-31", "$30", "TRAFFORD", "USA"),
    new Product("PINTUK DETAILED EMBROIDERED DRESS", "images/goods/fabric/image02.jpg", "Model Height 5' 6", "Wearing size UK 10 Please bear in mind that the photo may be slightly different from the actual item.", "Fabric", "2022-11-15", "$25", "TENDENZA", "Canada"),
    new Product("BOY SCHOOL UNIFORM SHORT", "images/goods/fabric/image03.jpg", "Model Height 4' 5", "wearing size 28 Please bear in mind that the photo may be slightly different from the actual item in terms of colour", "Fabric", "2021-10-30", "$40", "N/A", "Sri Lanka"),
    new Product("GIRL’S PRINTED FROCK", "images/goods/fabric/image04.jpg", "Please bear in mind that the photo may be slightly different from the actual item", "Fabric", "2021-02-28", "$35", "SilkSense", "Australia"),
    new Product("PRINTED BATIK SARONG", "images/goods/fabric/image05.jpg", "Hand wash with cold water, Wash inside out dark colors separately, Dry in a shade", "Fabric", "2020-04-20", "$45", "IndiaFabrics", "India"),
    new Product("LONG SLEEVE FORMAL SHIRT", "images/goods/fabric/image06.jpg", "Hand wash with cold water, Wash inside out dark colors separately, Dry in a shade", "Fabric", "2021-02-28", "$35", "SilkSense", "Australia"),
    new Product("DETAILED CROP TOP", "images/goods/fabric/image07.jpg", "Model Height 5' 6\" wearing size M", "Fabric", "2020-09-20", "$45", "EleganceFabrics", "USA"),
    
].sort(() => Math.random() - 0.5); // Randomize the array

// Create and populate the productsDB.db database
let productsDb = new sqlite3.Database('databases/productsDB.db');

productsDb.serialize(() => {
  productsDb.run('CREATE TABLE IF NOT EXISTS products (data TEXT)');

  const insertStmt = productsDb.prepare('INSERT INTO products (data) VALUES (?)');

  // Convert allProducts to JSON and insert it into the database
  insertStmt.run(JSON.stringify(allProducts));

  insertStmt.finalize();

  console.log('Products data saved to database.');
});

productsDb.close();
