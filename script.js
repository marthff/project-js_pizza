let cart = []; //cart = carruinho de compras (Array)
let modalQt = 1;//Qt = quantidade
let modalKey = 0;

/*Constante realizada para evitar a utilização de document.querySelector a todo momento*/
const c = (el)=> {
    return document.querySelector(el);
}
/*Constante realizada para evitar a utilização de document.querySelectorAll a todo momento*/
const cs = (el)=>document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index)=>{ //Item simboliza as pizzas, ou seja, cada elemento, já o index simboliza o numero desse item 
    let pizzaItem = c('.models .pizza-item').cloneNode(true); //Neste caso foi feito um cole do elemneto do HTML, pegando tudo o que tem em sua composição, se colocado o (true)
    // preencher as informações em pizzaitem

    pizzaItem.setAttribute('data-key', index) //data-key: data eh de informação e key é da chave do elemento(pizza) ---- Nessa linha se identificou cada piza como um elemento na pagina
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; //foi colocado duas img's para identificar que a segunda se trata de uma forma de pegar o endereçamento do elemento: img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;//toFixed executa a ação de dois items após a vírgula   
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    // Essa ação vai substituir a ação de atualizar a pagina, ao clicar na pizza ou no =, por outra aba de mais selecionamento da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); //Nessa linha está se identificando a var key, para o evento de click que colocada com o eleemnto e = a, onde dessa forma com o 'closest' vai captar o celemento colocado mais prócimo, no caso: .pizza-item 
        modalQt = 1; //Reset de quantidade do pedido para = 1.
        modalKey = key; //Variavel que indica a pizza que foi selecionada

        // colocando na tela os elementos da aba ao clicar na pizza: 
        c('.pizzaBig img').src = pizzaJson[key].img; //Está  se determinando a imagem igual a outro elemento
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; //Essa linha faz a colocação do prço em cada pizza
        c('.pizzaInfo--size.selected').classList.remove('selected'); //Nessa linha se excluiu a opção de se ter alguma opção ja selecionada de gramas da pizza
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //Para selecionar cada info (pequena, media e grande) - utilizou-se o all, justamente por ter 3 sizes
            if(sizeIndex == 2) { // Com essa linha a baico se deixa pré-selecionado a opção antes escolhida de gramas de pizza -- então quando tiver selecionado a pizza grande(sizeIndex = 2) o botão é selecionado para ficar pré-determinado
                size.classList.add('selected') 
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt; // Sempre que aberto a aba de pedir pizza, o modal é colocado como padrão = 1

        //No caso abaixo vai se colocar a opacidade em 0 -- colocar o display flex e após 200ms colocar a opacidade em 1, dessa forma o elemento vai aparecer mais suave
        c('.pizzaWindowArea').style.opacity = 0; // Essa função opacity basicamente simboliza a opacidade(mais/menos aparecendo) de algum elemento, que no caso foi 50% de opacidade
        c('.pizzaWindowArea').style.display = 'flex'; //Este elemento que foi colocado o display flex simboliza a aba que aparece ao clicar na pizza ou no +
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    }); //Primeiro de selecionou a tag a: que no Html possui a função de atualizar a tela após clicar na pizza ou no + --- Procedindo addEventListener colocou um evento em algum termo   
    

    c('.pizza-area').append( pizzaItem );  //Função feita para adicionar na tela -- .append() = Com essa função o conteudo que tinha antes é pego e adicionado mais um conteúdo, ex: caso fosse innerHTML = os conteudos que tinham são substituídos

});

//Eventos do modal
function closeModal() { //Neste caso como se deseja fechar o modal, basta fazer a ação contrária
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{ //Após a opacidade 0, se espera meio segundo e o modal é fechado por completo
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
//Selecionação dos dois botões para fechar: --- onde para cada um deles é adicionado a função de click:
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
//Configuração do botão de mais e de menos
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
//Função para clicar em cada tamanho de pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //Seleciona o tamanho --- o parseInt é para transformar em string um elemento

    let identifier = pizzaJson[modalKey].id+'@'+size; //Para identificar as pizzas selecionadas

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({ //Os items abaixo são os items que vao para o carrinho
            identifier,
            id:pizzaJson[modalKey].id,
            size,
             qt:modalQt
        });
    }
    updateCart();
    closeModal(); //Para fechar o modal após selecionar os itens para o carrinho
});

c('.menu-openner').addEventListener('click', () => { 
    if(cart.length > 0) { //Se tiver itens colocados no carrinho, o carrinho aparecerá
        c('aside').style.left = '0'; //left 0 - significa que o carrinho sai da direita e vai para a esquerda 0, cobrindo tela inteira
    }
});
c('.menu-closer').addEventListener('click', ()=>{ //Função para clicar no x e fechar a aba carrinho no mobile
    c('aside').style.left = '100vw'; // coloca a aba carrinho toda para a direita
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length; // Coloca a quantidade de pizzas selecionadas no mobile
    
    if(cart.length > 0) { //Caso tenha itens no carrinho
        c('aside').classList.add('show'); // Dessa forma com a função show os itens que ja se tinha anteriormente serão mostrados
        c('.cart').innerHTML = ''; //Zerando o carrinho para selecionar mais itens
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) { // Adicionar as informações da pizza no carrinho
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt; //Dessa forma vai se realizar um subtotal a partir da checagem de cada item

            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('img').src = pizzaItem.img;//Adicionando a imagem da pizza selecionada no carrinho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //Demonstração da quantidade de pizzas selecionadas
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{ //Ação para diminuir a quantidade de pizza
                if(cart[i].qt > 1) { //Só vai ser retirado um item do carrinho quando for maior do que 1 a quantidade presente
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{ //Ação para aumentar a quantidade de pizza
                cart[i].qt++; 
                updateCart(); //Toda vez que o botão de mais ou de menos for precionado o carrinho vai ser atualizado
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;//O toFixed serve para se ter dois items
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else { //O carrinho será tirado de tela 
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw' //Função para fechar o carrinho no celular
    }
}