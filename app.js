window.addEventListener('load', () => {
  const searchInput = document.querySelector('#search-input');
  const usersMessage = document.querySelector('#users-message');
  const statisticsContainer = document.querySelector('#statistics-container');
  const statisticsMessage = document.querySelector('#statistics-message');
  const statisticsPanel = document.querySelector('#statistics-display');
  const usersPanel = document.querySelector('#users-display');

  /* Buscar os dados da API via requisição HTTP GET  */
  const getUsersFromAPI = async () => {
    const response = await fetch(
      'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo',
    );
    const data = await response.json();
    return data.results;
  };

  /* Renderiza os usuários e estatísticas na interface de usuáirio */
  const renderContent = async (inputValue) => {
    let stats = {
      males: 0,
      females: 0,
      agesSum: 0,
    };

    // Pegando a lista de usuários da API
    const allUsers = await getUsersFromAPI();

    /* Formatando a lista de usuários */
    const users = [...allUsers].map((user) => {
      return {
        name: user.name.first + ' ' + user.name.last,
        gender: user.gender,
        age: user.dob.age,
        avatar: user.picture.large,
      };
    });

    /* Filtrando a lista de usuários a partir do valor do input */
    const filteredUsers = users.filter((user) => {
      let name = user.name.toLowerCase();

      if (name.includes(inputValue.toLowerCase())) {
        return user;
      }
    });

    /* Renderizando a lista de usuários filtrados na interface de usuário */
    usersMessage.innerHTML = `${filteredUsers.length} usuário(s) encontrado(s)`;
    usersPanel.innerHTML = '';

    filteredUsers.forEach((user) => {
      user.gender === 'male' ? stats.males++ : stats.females++;
      stats.agesSum += user.age;

      usersPanel.insertAdjacentHTML(
        'beforeend',
        `<div class="user-info">
          <img src="${user.avatar}" />
          <p>${user.name}, ${user.age}</p>
        </div>`,
      );
    });

    /* Renderizando as estatísticas na interface de usuário */
    statisticsMessage.innerHTML = 'Estatísticas';
    statisticsPanel.innerHTML = '';

    statisticsPanel.insertAdjacentHTML(
      'beforeend',
      `<div id="statistics">
        <p>Quantidade de homens: ${stats.males}</p>
        <p>Quantidade de mulheres: ${stats.females}</p>
        <p>Soma das idades: ${stats.agesSum} anos</p>
        <p>Média das idades: ${stats.agesSum / filteredUsers.length} anos</p>
      </div>`,
    );
  };

  /* **** EVENT LISTENERS **** */

  /* Caixa de pesquisa */
  searchInput.addEventListener('change', () => {
    let inputValue = searchInput.value.toLowerCase();
    renderContent(inputValue);
    searchInput.focus();
  });
});
