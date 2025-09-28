// Importa a biblioteca Swiper e seus estilos CSS
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * @function showHomePage
 * @description Renderiza a página inicial com um carrossel de imagens de serviços e uma mensagem de boas-vindas.
 * @param {function} renderContent - Função para renderizar o conteúdo principal na div #content.
 */
const showHomePage = (renderContent) => {
  renderContent(`
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <!-- Slide 1: Cortes Modernos -->
        <div class="swiper-slide">
          <img src="https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Salon Image 1">
          <div class="slide-description">
            <h3>Cortes Modernos</h3>
            <p>Nossos estilistas são especialistas em cortes modernos e personalizados.</p>
          </div>
        </div>
        <!-- Slide 2: Coloração e Mechas -->
        <div class="swiper-slide">
          <img src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Salon Image 2">
          <div class="slide-description">
            <h3>Coloração e Mechas</h3>
            <p>Realce sua beleza com nossas técnicas de coloração e mechas.</p>
          </div>
        </div>
        <!-- Slide 3: Tratamentos Capilares -->
        <div class="swiper-slide">
          <img src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Salon Image 3">
          <div class="slide-description">
            <h3>Tratamentos Capilares</h3>
            <p>Recupere a saúde e o brilho dos seus cabelos com nossos tratamentos.</p>
          </div>
        </div>
      </div>
      <!-- Paginação do carrossel -->
      <div class="swiper-pagination"></div>
      <!-- Botões de navegação do carrossel -->
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
    <h2 class="text-2xl font-semibold mb-4">Bem-vindo ao Salão de Beleza!</h2>
    <p>Agende seus serviços de beleza favoritos de forma rápida e fácil.</p>
    <p>Explore nossos serviços e encontre o horário perfeito para você.</p>
  `);

  // Inicializa o Swiper com as opções desejadas
  // eslint-disable-next-line no-unused-vars
  const swiper = new Swiper('.swiper-container', {
    loop: true, // Permite que o carrossel rode infinitamente
    autoplay: {
      delay: 2500, // Tempo de exibição de cada slide em milissegundos
      disableOnInteraction: false, // Continua o autoplay mesmo após interação do usuário
    },
    pagination: {
      el: '.swiper-pagination', // Elemento para a paginação
      clickable: true, // Permite clicar na paginação para navegar
    },
    navigation: {
      nextEl: '.swiper-button-next', // Elemento para o botão 'próximo'
      prevEl: '.swiper-button-prev', // Elemento para o botão 'anterior'
    },
  });
};

export { showHomePage };
