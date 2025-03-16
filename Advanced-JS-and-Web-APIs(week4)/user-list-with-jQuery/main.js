(async () => {
  const appendLocation = "#user-list"; // Append edilecek ana selector, değiştirilebilir.

  // jQuery kütüphanesini dinamik olarak yükle
  if (typeof jQuery === "undefined") {
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    await new Promise((resolve) => {
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  //Stiller
  const addStyles = () => {
    const styles = `
      .user-container {
        max-width: 600px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
      }
      .user-item {
        padding: 12px 15px;
        margin-bottom: 8px;
        background-color: #f8f9fa;
        border-radius: 5px;
        border-left: 4px solid #007bff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
      }
      .user-item:hover {
        background-color: #e9ecef;
        transform: translateY(-2px);
      }
      .user-info {
        flex-grow: 1;
      }
      .delete-icon {
        color: #dc3545;
        cursor: pointer;
        font-weight: bold;
        margin-left: 10px;
      }
      #reload-button {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        margin-top: 15px;
        transition: background-color 0.3s;
      }
      #reload-button:hover {
        background-color: #218838;
      }
      .app-title {
        color: #343a40;
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
      }
      .empty-message {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        margin: 20px 0;
      }
    `;

    $("<style>").text(styles).appendTo("head");

    // Başlık ekle
    if (!$(".app-title").length) {
      $(appendLocation).before('<h2 class="app-title">Kullanıcı Listesi</h2>');
    }

    // Container sınıfı ekle
    if (!$(appendLocation).hasClass("user-container")) {
      $(appendLocation).addClass("user-container");
    }
  };

  // Kullanıcıları localStorage'dan getir veya API'den çek
  const fetchUsers = async () => {
    addStyles(); // Stiller ekleme

    if (!localStorage.getItem("users") || isExpired()) {
      const users = await $.get("https://jsonplaceholder.typicode.com/users");
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("expire", Date.now() + 60000); // 1 dakika süreli
      renderUsers(users);
    } else {
      renderUsers(JSON.parse(localStorage.getItem("users")));
    }
  };

  // Expire süresi dolmuş mu kontrol et
  const isExpired = () =>
    !localStorage.getItem("expire") ||
    Date.now() > localStorage.getItem("expire");

  // Kullanıcıları render et
  const renderUsers = (users) => {
    const $container = $(appendLocation);
    $container.empty();
    if (users.length === 0) {
      $container.append('<p class="empty-message">Kullanıcı listesi boş</p>');
    } else {
      users.forEach(({ id, name, email }) => {
        const $userItem = $(`
          <div class="user-item" data-id="${id}">
            <div class="user-info">${name} - ${email}</div>
            <span class="delete-icon" title="Kullanıcıyı Sil">✖</span>
          </div>
        `);
        $userItem.find(".delete-icon").on("click", () => deleteUser(id));
        $container.append($userItem);
      });
    }
    checkUserCount();
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = (userId) => {
    const users =
      JSON.parse(localStorage.getItem("users"))?.filter(
        (user) => user.id !== userId
      ) || [];
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers(users);
  };

  // Kullanıcılar silindiğinde buton göster
  const checkUserCount = () => {
    const $container = $(appendLocation);
    if (
      JSON.parse(localStorage.getItem("users"))?.length === 0 &&
      !$("#reload-button").length
    ) {
      const $reloadButton = $(
        "<button id='reload-button'>Kullanıcıları Yeniden Getir</button>"
      );
      $reloadButton.on("click", reloadUsers);
      $container.append($reloadButton);
    }
  };

  // Kullanıcıları yeniden yükleme butonu fonksiyonu
  const reloadUsers = () => {
    if (!sessionStorage.getItem("reloadUsed")) {
      sessionStorage.setItem("reloadUsed", "true");
      localStorage.removeItem("users"); // Eski kullanıcıları temizle
      localStorage.removeItem("expire"); // Expire süresini sıfırla
      fetchUsers(); // Yeni kullanıcıları getir
    }
  };

  // MutationObserver ile butonu takip et
  new MutationObserver(checkUserCount).observe($(appendLocation)[0], {
    childList: true,
  });

  $(fetchUsers);
})();
