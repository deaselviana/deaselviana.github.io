window.onload = function () {
	// ambil data url
	const url = new URL(window.location.href).pathname;

	document.querySelectorAll('.navbar__nav--link').forEach((navLink) => {
		const isActive = new URL(navLink.href).pathname === url;

		if (!isActive) {
			return;
		}

		// merubah title menjadi dinamis dan mengaktifkan
		// menu berdasarkan page yang sedang aktif
		document.title = `Dea - ${navLink.textContent}`;
		navLink.classList.add('--active');
	});

	// button untuk responsive design, hanya akan tampil ketika screenwidth
	// menyampai ukuran mobile screen width selain itu tidak akan tampil
	document
		.querySelector('button.navbar__close')
		.addEventListener('click', function () {
			const icon = this.querySelector('span');
			const nav = document.querySelector('.navbar__nav');

			// menambah class active ketika button dipencet
			icon.classList[
				icon.hasAttribute('class') && icon.classList.contains('--active')
					? 'remove'
					: 'add'
			]('--active');

			// menambah class active ketika button dipencet
			nav.classList[
				nav.hasAttribute('class') && nav.classList.contains('--active')
					? 'remove'
					: 'add'
			]('--active');
		});

	// select beberapa element yang dibutuhkan
	const navbar = document.querySelector('.navbar');

	// menambahkan border bottom pada navbar
	// ketika navbar discroll sampai
	// posisi tertentu pada page
	document.addEventListener('scroll', function (evt) {
		navbar.classList[
			evt.target.body.scrollTop > 30 ||
			evt.target.documentElement.scrollTop > 30
				? 'add'
				: 'remove'
		]('--active');
	});

	url === '/workpage.html' &&
		(() => {
			const cta = document.querySelector('.cta');
			const elementCta = cta.querySelector('.content__project--cta');

			const projectShowCount = 6;

			// hanya sebuah fungsi untuk menampilkan project ke dalam project list
			const appendProjectList = (list, container) => {
				list.forEach((item) => {
					// membuat element-element yang diperlukan untuk menampilkan list
					// project ke dalam DOM
					const elementProjectImage = document.createElement('img');
					const elementProjectList = document.createElement('div');

					elementProjectImage.alt = `Image for project-${item.id}`;
					elementProjectImage.className = 'content__project--image';
					elementProjectImage.src = item.image;

					elementProjectList.className = 'content__project--list';
					elementProjectList.style.height = '300px';

					// menambahkan element-element yand sudah dibuat ke dalam DOM
					elementProjectList.appendChild(elementProjectImage);
					container.appendChild(elementProjectList);
				});
			};

			// menampilkan list project secara dinamis berdasarkan
			// data yang diperoleh dari /asset/json/data.json
			// yang mana akan ditampilkan ke dalam DOM
			const refreshProjectList = (counter, list) => {
				const currentList = list.slice(counter, counter + projectShowCount);
				const container = document.querySelector('.content__project');

				// jika jumlah project yang ditampilkan sudah mencapai batasnya
				// maka tombol Load More akan dihilangkan dan akan menampilkan
				// peringatan bahwa project sudah mencapai batas maksimalnya
				if (counter + projectShowCount >= list.length) {
					// jika list yang ingin ditampilkan masih memiliki items di dalamnya
					// maka tampilkan terlebih dahulu list yang masih tersisa di dalam
					if (currentList.length > 0) {
						appendProjectList(currentList, container);
					}

					const elementMaxIndicator = document.createElement('span');

					elementMaxIndicator.className = '.content__project--max';
					elementMaxIndicator.innerHTML = 'End of projects list';

					// menghapus button dan menambahkan element peringatan
					cta.removeChild(elementCta);
					cta.appendChild(elementMaxIndicator);
					return;
				}

				appendProjectList(currentList, container);
			};

			// fetch data dari /asset/json/data.json untuk list project
			// yang tersedia untuk kemudian ditampilkan ke dalam DOM
			(async () => {
				// ambil data json dari /asset/json/data.json
				const response = await fetch('/asset/json/data.json');
				const data =
					response.status === 200 || response.ok
						? await response.json()
						: { project: { items: [] } };

				refreshProjectList(0, data.project.items);

				// meneruskan data ke dalam resolved promise
				return Promise.resolve(data);
			})().then((data) => {
				let counter = 0;

				// menambahkan event click pada button 'Load More' agar ketika
				// button diklik, maka akan menampilkan list data baru
				// seperti pagination
				cta.contains(elementCta) &&
					elementCta.addEventListener('click', () => {
						refreshProjectList(counter + projectShowCount, data.project.items);
						counter += projectShowCount;
					});
			});
		})();

	url === '/aboutpage.html' &&
		(() => {
			const progressBarContainers = document.querySelectorAll(
				'.skill__list--progress'
			);

			// hanya sebuah fungsi untuk menampilkan persentase progress
			// skill alias mengubah width dari element progress skill
			progressBarContainers.forEach((container) => {
				const progressBar = container.querySelector('span');
				progressBar.style.width = `${progressBar.dataset.progress}%`;
			});
		})();
};
