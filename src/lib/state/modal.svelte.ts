class ModalState {
	video = $state<{ id: string; title: string; isLocal?: boolean } | null>(null);
	countryOpen = $state(false);
	retailerModal = $state<{ productTitle: string; brand: string } | null>(null);

	openVideo(id: string, title: string, isLocal = false) {
		this.video = { id, title, isLocal };
	}

	closeVideo() {
		this.video = null;
	}

	openCountry() {
		this.countryOpen = true;
	}

	closeCountry() {
		this.countryOpen = false;
	}

	openRetailer(productTitle: string, brand: string) {
		this.retailerModal = { productTitle, brand };
	}

	closeRetailer() {
		this.retailerModal = null;
	}
}

export const modal = new ModalState();
