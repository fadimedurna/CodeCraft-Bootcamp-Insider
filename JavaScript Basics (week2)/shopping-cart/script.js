// Cart array
let cart = [];

// User object
let user = {};

// Function to get user information
function getUserInfo() {
  user.name = prompt("Adınız nedir?");
  user.age = parseInt(prompt("Yaşınız kaç?"));
  user.job = prompt("Mesleğiniz nedir?");
  console.log("Kullanıcı Bilgileri:", user);
}

// Adding product dynamically
function addProduct() {
  const name = prompt("Sepete eklemek istediğiniz ürünü yazın:");
  const price = parseFloat(prompt("Ürünün fiyatı:"));
  if (name && !isNaN(price)) {
    const product = { product: name, price: price };
    cart.push(product);
    console.log(`Ürün sepete eklendi: ${JSON.stringify(product)}`);
  } else {
    console.log("Geçersiz ürün bilgisi.");
  }
}

// Listing products in the cart
function listCart() {
  if (cart.length === 0) {
    console.log("Sepetiniz boş.");
  } else {
    console.log("Sepetiniz:");
    cart.forEach((item, index) => {
      console.log(`${index + 1}. ${JSON.stringify(item)}`);
    });
  }
}

// Calculating total price
function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  console.log(`Toplam Fiyat: ${total.toFixed(2)} TL`);
}

// Removing a product from the cart
function removeProduct() {
  listCart();
  const index =
    parseInt(prompt("Çıkarmak istediğiniz ürünün numarasını girin:")) - 1;
  if (index >= 0 && index < cart.length) {
    const removedItem = cart.splice(index, 1)[0];
    console.log(`Ürün sepetten çıkarıldı: ${JSON.stringify(removedItem)}`);
  } else {
    console.log("Geçersiz ürün numarası.");
  }
}

// Main function to run the shopping cart
function runShoppingCart() {
  console.log("Alışveriş Sepeti Uygulamasına Hoş Geldiniz!");

  while (true) {
    const command = prompt(
      "Bir komut girin:" +
        "\n" +
        "kullanıcı ekle(1)/ ürün ekle(2)/ sepet(3)/ toplam tutar(4)/ ürün çıkar(5)/ çıkış(x)"
    ).toLowerCase();

    switch (command) {
      case "1":
        getUserInfo();
        break;
      case "2":
        addProduct();
        break;
      case "3":
        listCart();
        break;
      case "4":
        calculateTotal();
        break;
      case "5":
        removeProduct();
        break;
      case "x":
        console.log("Alışverişiniz için teşekkürler!");
        return;
      default:
        console.log("Geçersiz komut. Lütfen tekrar deneyin.");
    }
  }
}

// Run the shopping cart when the page loads
window.onload = runShoppingCart;
