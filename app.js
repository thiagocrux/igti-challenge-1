window.addEventListener('load', () => {
	const searchInput = document.querySelector('#search-input');
	const searchButton = document.querySelector('#search-button');
	const statisticsPanel = document.querySelector('#statistics-display');
	const usersPanel = document.querySelector('#users-display');

	/* Busca os dados da API via requisição HTTP GET  */
	const getUsersFromAPI = async () => {
		const dataFetchedFromAPI = await fetch(
			'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
		);
		const dataConvertedToJSON = await dataFetchedFromAPI.json();
		return dataConvertedToJSON.results;
	};

	/* Renderiza os usuários e estatísticas na interface de usuário */
	const renderContentToUI = async (inputValue) => {
		let stats = {
			males: 0,
			females: 0,
			agesSum: 0,
		};

		// Recebe a lista de usuários da API
		const usersFromAPI = await getUsersFromAPI();

		/* Formatando a lista de usuários */
		const users = [...usersFromAPI].map((user) => {
			return {
				name: user.name.first + ' ' + user.name.last,
				gender: user.gender,
				age: user.dob.age,
				avatar: user.picture.large,
			};
		});

		const clearStatisticsFromUI = () => {
			statisticsPanel.innerHTML = '';
		};

		const clearUsersFromUI = () => {
			usersPanel.innerHTML = '';
		};

		/* Filtrando a lista de usuários a partir do valor do input */
		const filteredUsers = users.filter((user) => {
			let name = user.name.toLowerCase();

			if (name.includes(inputValue.toLowerCase())) {
				return user;
			}
		});

		/* Renderizando as estatísticas na interface de usuário */
		const renderStatisticsToUI = () => {
			clearStatisticsFromUI();
			statisticsPanel.insertAdjacentHTML(
				'beforeend',
				`<p id="heading">ESTATÍSTICAS</p>
					<p class="message">${filteredUsers.length} usuário(s) encontrado(s)</p>
					<div id="statistics">
						<div>
							<p>Número de homens</p> <span>${stats.males}</span>
						</div>
						<div>
							<p>Número de mulheres</p> <span>${stats.females}</span>
						</div>
						<div>
							<p>Soma das idades</p> <span>${stats.agesSum}</span>
						</div>
						<div>
							<p>Média das idades</p> <span>${(stats.agesSum / filteredUsers.length).toFixed(1)}</span>
						</div>
					</div>`
			);
		};

		/* Renderizando a lista de usuários filtrados na interface de usuário */
		const renderUsersToUI = () => {
			clearUsersFromUI();
			filteredUsers.forEach((user) => {
				user.gender === 'male' ? stats.males++ : stats.females++;
				stats.agesSum += user.age;
				usersPanel.insertAdjacentHTML(
					'beforeend',
					`<div class="user-info">
						<img src="${user.avatar}" />
						<div>
							<p>${user.name}</p>
							<p>${user.age} anos</p>
						</div>
					</div>`
				);
			});
			renderStatisticsToUI();
		};

		renderUsersToUI();
	};

	/* **** EVENT LISTENERS **** */

	/* Caixa de pesquisa */
	searchInput.addEventListener('change', () => {
		let inputValue = searchInput.value;
		renderContentToUI(inputValue);
		searchInput.focus();
	});

	/* Botão de pesquisa */
	searchButton.addEventListener('click', () => {
		let inputValue = searchInput.value;
		renderContentToUI(inputValue);
		searchInput.focus();
	});
});
