function loadJQuery(callback) {
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
  script.integrity = "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=";
  script.crossOrigin = "anonymous";
  script.onload = callback;
  document.head.appendChild(script);
}

loadJQuery(function () {
  $(document).ready(function () {
    // Create and style the container elements
    const $container = $("<div>").attr("id", "container");
    const $header = $("<header>");
    const $title = $("<h1>").text("Product Catalog");
    const $productGrid = $("<div>").attr("id", "productGrid");

    // Create popup elements
    const $popup = $("<div>").attr("id", "popup").hide();
    const $popupContent = $("<div>").attr("id", "popupContent");
    const $closeButton = $("<button>").attr("id", "closePopup").html("&times;");

    // Append elements to the DOM
    $header.append($title);
    $popup.append($popupContent, $closeButton);
    $container.append($header, $productGrid);
    $("body").append($container, $popup);

    // Apply styles
    $("body").css({
      "font-family": "Arial, sans-serif",
      margin: "0",
      padding: "0",
      "background-color": "#f5f5f5",
      "overflow-x": "hidden",
      "overflow-y": "auto",
      height: "100vh",
      position: "relative",
    });

    $container.css({
      "max-width": "1200px",
      margin: "0 auto",
      padding: "20px",
    });

    $header.css({
      display: "flex",
      "flex-direction": "column",
      "justify-content": "space-between",
      "align-items": "center",
      "margin-bottom": "30px",
    });

    $title.css({
      color: "#333",
      margin: "20px 0",
    });

    $productGrid.css({
      display: "grid",
      "grid-template-columns": "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
    });

    $popup.css({
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      "background-color": "rgba(0, 0, 0, 0.7)",
      display: "none", // "none" to hide when page initially loads
      "justify-content": "center",
      "align-items": "center",
      "z-index": "1000",
    });

    $popupContent.css({
      "background-color": "white",
      padding: "30px",
      "border-radius": "8px",
      "max-width": "600px",
      width: "80%",
      "max-height": "80vh",
    });

    $closeButton.css({
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "none",
      border: "none",
      fontSize: "24px",
      fontWeight: "bold",
      color: "white",
      cursor: "pointer",
      padding: "5px 10px",
      zIndex: "1001",
    });

    loadProducts();

    function loadProducts() {
      $.ajax({
        url: "products.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
          $productGrid.empty();

          $.each(data.products, function (index, product) {
            const $productCard = $("<div>")
              .addClass("product-card")
              .attr("data-id", product.id);

            //Div for image container
            const $imageContainer = $("<div>").addClass(
              "product-image-container"
            );
            const $productImage = $("<img>")
              .attr("src", product.image)
              .attr("alt", product.name);
            $imageContainer.append($productImage);

            //Div for content container
            const $contentContainer = $("<div>").addClass(
              "product-content-container"
            );
            const $productName = $("<h3>").text(product.name);
            const $productPrice = $("<p>")
              .addClass("price")
              .text("$" + product.price.toFixed(2));
            const $productCategory = $("<p>")
              .addClass("category")
              .text(product.category);
            $contentContainer.append(
              $productName,
              $productPrice,
              $productCategory
            );

            $productCard.append($imageContainer, $contentContainer);
            $productGrid.append($productCard);

            // Style the product card
            $productCard.css({
              "background-color": "white",
              "border-radius": "8px",
              padding: "20px",
              "box-shadow": "0 2px 5px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "flex-direction": "column",
            });

            $imageContainer.css({
              "margin-bottom": "15px",
            });

            $productImage.css({
              width: "100%",
              height: "auto",
              "border-radius": "4px",
            });

            $contentContainer.css({
              display: "flex",
              "flex-direction": "column",
              gap: "5px",
            });

            $productName.css({
              margin: "0 0 10px 0",
              color: "#333",
            });

            $productPrice.css({
              "font-weight": "bold",
              color: "#4CAF50",
              margin: "5px 0",
            });

            $productCategory.css({
              color: "#777",
              margin: "5px 0",
              "font-size": "14px",
            });

            // Add hover effect for product card
            $productCard.each(function () {
              $(this).hover(
                function () {
                  $(this).animate(
                    {
                      marginTop: "-3px",
                    },
                    300
                  );
                  $(this).css("box-shadow", "0 10px 20px rgba(0,0,0,0.15)");
                },
                function () {
                  $(this).animate(
                    {
                      marginTop: "0",
                    },
                    300
                  );
                  $(this).css("box-shadow", "0 2px 5px rgba(0,0,0,0.1)");
                }
              );
            });

            // Add click event for popup
            $productCard.on("click", function () {
              const productId = $(this).data("id");
              const selectedProduct = data.products.find(
                (p) => p.id === productId
              );

              // Populate popup content
              $popupContent.empty();

              const $popupHeader = $("<div>").addClass("popup-header");
              const $popupTitle = $("<h2>").text(selectedProduct.name);
              const $popupImage = $("<img>")
                .attr("src", selectedProduct.image)
                .attr("alt", selectedProduct.name);
              const $popupPrice = $("<p>")
                .addClass("popup-price")
                .text("$" + selectedProduct.price.toFixed(2));
              const $popupCategory = $("<p>")
                .addClass("popup-category")
                .text("Category: " + selectedProduct.category);
              const $popupDetails = $("<p>")
                .addClass("popup-details")
                .text(selectedProduct.details);
              const $popupLink = $("<a>")
                .attr("href", selectedProduct.link)
                .attr("target", "_blank")
                .text("Visit Product Page");

              $popupHeader.append($popupTitle, $popupPrice);
              $popupContent.append(
                $popupHeader,
                $popupImage,
                $popupCategory,
                $popupDetails,
                $popupLink
              );

              // Style popup elements
              $popupHeader.css({
                display: "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "margin-bottom": "20px",
              });

              $popupTitle.css({
                margin: "0",
                color: "#333",
              });

              $popupPrice.css({
                "font-size": "24px",
                "font-weight": "bold",
                color: "#4CAF50",
                margin: "0",
              });

              $popupImage.css({
                width: "100%",
                "max-height": "300px",
                "object-fit": "contain",
                "margin-bottom": "20px",
                "border-radius": "4px",
              });

              $popupCategory.css({
                color: "#777",
                "margin-bottom": "15px",
              });

              $popupDetails.css({
                "line-height": "1.6",
                "margin-bottom": "20px",
              });

              $popupLink.css({
                display: "inline-block",
                "background-color": "#4CAF50",
                color: "white",
                padding: "10px 20px",
                "text-decoration": "none",
                "border-radius": "5px",
                transition: "background-color 0.3s",
              });

              // Show popup with animation
              $popup
                .css({
                  display: "flex",
                })
                .fadeIn(300);

              $popupLink.hover(
                function () {
                  $(this).animate(
                    {
                      backgroundColor: "#45a049",
                    },
                    300
                  );
                },
                function () {
                  $(this).animate(
                    {
                      backgroundColor: "#4CAF50",
                    },
                    300
                  );
                }
              );
            });
          });
        },
        error: function (xhr, status, error) {
          console.error("Error loading products:", error);
          $productGrid.html(
            "<p>Error loading products. Please try again later.</p>"
          );
        },
      });
    }

    // Close popup when clicking outside the popup content
    $popup.on("click", function (e) {
      if (e.target === this) {
        $popup.fadeOut(300);
      }
    });
    // Close popup when clicking the close button
    $closeButton.on("click", function () {
      $popup.fadeOut(300);
    });
  });
});
