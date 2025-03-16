document.addEventListener("DOMContentLoaded", () => {
  // Sayfaya stil ekle
  const addStyles = () => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
            .ins-api-users {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
            }
            
            h1 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
            
            .user-card {
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .user-card h2 {
                margin-top: 0;
                color: #2c3e50;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            
            .user-card p {
                margin: 8px 0;
                line-height: 1.5;
            }
            
            .error-message {
                background-color: #f8d7da;
                color: #721c24;
                font-weight: bold;
                padding: 10px;
                border-radius: 5px;
                margin: 20px auto;
                max-width: 800px;
                text-align: center;
            }

             .delete-btn {
                width: 80px;
                height: 30px;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
            
            .delete-btn:hover {
                background-color: #c82333;
            }
            
            .user-actions {
                display: flex;
                justify-content: flex-end;
                margin-top: 10px;
            }
        `;
    document.head.appendChild(styleElement);
  };
  addStyles();

  //Fetch Users data from API
  const fetchUsers = () => {
    return new Promise((resolve, reject) => {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          console.log("Fetch yanıtı alındı:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((users) => {
          
          console.log("Kullanıcı verileri başarıyla alındı!");
          //console.log(users);

          // Verileri localStorage'a kaydet
          const userData = {
            data: users,
            timestamp: new Date().getTime(), // Şu anki zaman damgası
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("Veriler localStorage'a kaydedildi");

          //a; //Error mesajını görmek için
          //fetch başarılıysa resolve
          resolve(users);
          console.log("Promise resolve edildi.");
        })
        .catch((error) => {
          console.error("Error fetching users:", error);

          // Error mesajı ekranda göster
          const errorMessage = document.createElement("div");
          errorMessage.className = "error-message";
          errorMessage.textContent = `Failed to load users: ${error.message}`;
          document.body.appendChild(errorMessage);

          reject(error);
          console.log("Promise reject edildi");
        });
    });
  };

  // Kullanıcı verilerini getir (önce localStorage'dan, gerekirse API'den)
  const getUserData = () => {
    // localStorage'dan veriyi kontrol et
    const storedData = localStorage.getItem("userData");

    if (storedData) {
      const userData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // 1 gün (milisaniye cinsinden)

      // Veri 1 günden daha yeni mi kontrol et
      if (currentTime - userData.timestamp < oneDay) {
        console.log("Veriler localStorage'dan alındı");
        return Promise.resolve(userData.data);
      } else {
        console.log(
          "localStorage'daki veri eskimiş, API'den yeni veri alınıyor"
        );
        localStorage.removeItem("userData"); // Eski veriyi temizle
      }
    }

    // localStorage'da veri yoksa veya eskiyse API'den al
    console.log("API'den veri alınıyor");
    return fetchUsers();
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = (userId) => {
    // localStorage'dan mevcut kullanıcıları al
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const userData = JSON.parse(storedData);

      // Kullanıcıyı filtrele (silinen kullanıcıyı çıkar)
      const updatedUsers = userData.data.filter((user) => user.id !== userId);

      // Güncellenmiş kullanıcı listesini localStorage'a kaydet
      const updatedUserData = {
        data: updatedUsers,
        timestamp: userData.timestamp, // Zaman damgasını koru
      };

      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      console.log(
        `Kullanıcı ID: ${userId} silindi ve localStorage güncellendi`
      );

      // Kullanıcı listesini güncelle
      displayUsers(updatedUsers);
    }
  };

  // Kullanıcı verilerini göster
  const displayUsers = (users) => {
   
    const apiUsersContainer = document.querySelector(".ins-api-users");

    if (!apiUsersContainer) {
      console.error("'.ins-api-users' elementi bulunamadı!");
      return;
    }

    // Önceki içeriği temizle
    apiUsersContainer.innerHTML = "";

    // Başlık
    const heading = document.createElement("h1");
    heading.textContent = "Kullanıcı Listesi";
    apiUsersContainer.appendChild(heading);

    // Her kullanıcı için kart
    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className = "user-card";

      const address = user.address;
      const formattedAddress = `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;

      // Kullanıcı kartının içeriği
      userCard.innerHTML = `
                <div class="user-info">
                    <h2>${user.id}) ${user.name}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Adres:</strong> ${formattedAddress}</p>
                </div>
                <div class="user-actions">
                    <button class="delete-btn" data-id="${user.id}">Sil</button>
                </div>
            `;

      apiUsersContainer.appendChild(userCard);
    });

    // Silme butonları olay dinleyicileri
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const userId = parseInt(e.target.dataset.id);
        if (
          confirm(`${userId}. kullanıcıyı silmek istediğinizden emin misiniz?`)
        ) {
          deleteUser(userId);
        }
      });
    });
  };

  //genel çağrı 
  getUserData()
    .then((users) => {
      displayUsers(users);
    })
    .catch((error) => {
      console.error("Kullanıcı verileri alınamadı:", error);
    });
});
