


document.addEventListener("DOMContentLoaded", function () {
	const carousel = document.getElementById("carousel");
	const imageHeight = 187 + 15; // Image height + spacing

	function scrollByAmount(amount) {
		carousel.scrollBy({ top: amount, behavior: "smooth" });
	}

	// Buttons
	document.getElementById("arrow-up").addEventListener("click", () => scrollByAmount(-imageHeight));
	document.getElementById("arrow-down").addEventListener("click", () => scrollByAmount(imageHeight));

	// Mouse wheel scrolling (only when hovering over the carousel)
	carousel.addEventListener("wheel", (event) => {
		event.preventDefault();
		scrollByAmount(event.deltaY > 0 ? imageHeight : -imageHeight);
	});



	// ================== smoooth 
	document.addEventListener("DOMContentLoaded", function () {
		const smoothCarousel = document.getElementById("smooth-carousel");

		// Enable native smooth scrolling on mouse wheel
		smoothCarousel.addEventListener("wheel", (event) => {
			event.preventDefault(); // Prevent default scrolling behavior
			smoothCarousel.scrollBy({ top: event.deltaY, behavior: "smooth" });
		});
	});


});
