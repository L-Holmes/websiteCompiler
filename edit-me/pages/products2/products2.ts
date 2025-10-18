
// ===================================================
// PROCESSING THE URL PARAMETERS  
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
	
	// Parent categories
	const category = (params.get('category') || '').toLowerCase();
	const categoryMap: Record<string, string> = { 
		products: 'cat-products', 
		blogs: 'cat-blogs' 
	};
	
	if (categoryMap[category]) {
		const el = document.getElementById(categoryMap[category]) as HTMLInputElement;
		if (el) el.checked = true;
	}
	
	// Mapping subcategory ID → parent checkbox ID
	const subToParent: Record<string, string> = {
		shoes: 'cat-products',
		boots: 'cat-products',
		tables: 'cat-products',
		article: 'cat-blogs',
		video: 'cat-blogs',
		newsub: 'cat-blogs',
		fourth: 'cat-blogs',
	};
	
	// Check subcategories
	const typeParam = params.get('type');
	if (typeParam) {
		typeParam.split(',').map(s => s.trim().toLowerCase()).forEach(sub => {
			const el = document.getElementById('type-' + sub) as HTMLInputElement;
			if (el) el.checked = true;
			
			// Check parent based on mapping
			const parentId = subToParent[sub];
			if (parentId) {
				const parentEl = document.getElementById(parentId) as HTMLInputElement;
				if (parentEl) parentEl.checked = true;
			}
		});
	}
});



