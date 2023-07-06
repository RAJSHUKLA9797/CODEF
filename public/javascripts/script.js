var scrollTop = 0;

$(".content-wrapper").scroll(function () {
	if ($(this).scrollTop() > 300) {
		$(".menu-bar-wrapper").css('bottom', -$(this).scrollTop());
		return false;
	}
	$(".menu-bar-wrapper").css('bottom', -$(this).scrollTop());
	var st = jQuery(this).scrollTop();

	if (st > 20) {
		if (st < scrollTop) {
			jQuery(".menu-bar").addClass("active");
		} else {
			jQuery(".menu-bar").removeClass("active");
		}
		scrollTop = st;
	}

});