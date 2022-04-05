const requestUrl = 'https://store.tildacdn.com/api/tgetproduct/'

let quantityText;

//Let`s get some info from server
async function sendRequest(method, url) {
  return new Promise ((resolve, reject) => {

    const xhr = new XMLHttpRequest()

    xhr.open(method, url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
        if (xhr.status >= 400) {
            reject(xhr.response)
        } else {
            resolve(xhr.response)
            let title = document.querySelectorAll('#title')
            let descr = document.querySelectorAll('#descr')
            let price = document.querySelectorAll('#price')
            let priceold = document.querySelectorAll('#priceold')
            let quantity = document.querySelectorAll('#quantity')
            for (var i=0; i < title.length; i++) {
              title[i].innerHTML = xhr.response.title 
            }
            for (var i=0; i < descr.length; i++) {
              descr[i].innerHTML = xhr.response.descr
            }
            for (var i=0; i < price.length; i++) {
              price[i].innerHTML = xhr.response.price
            }
            for (var i=0; i < priceold.length; i++) {
              priceold[i].innerHTML = xhr.response.priceold
            }            
            for (var i=0; i < quantity.length; i++) {
              quantity[i].textContent = xhr.response.quantity
            }
        }    
    }

    xhr.onerror = () => {
        reject(xhr.response)
    }
    xhr.send()  
  })
}

//Let`s get default image for our gallery
async function imgRequest(method, url) {
  return new Promise ((resolve, reject) => {

    const xhr = new XMLHttpRequest()
  
    xhr.open(method, url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response)
        let images = JSON.parse(xhr.response.images)
        images.reverse().slice(0, 1).forEach((item, index) => {
          let img = new Image();
          img.src = item.img;
          img.setAttribute('id', 'largeImg')
          pic = document.querySelectorAll('.thumb1')[0];
          pic.appendChild(img)
        });
      }
    }
    xhr.onerror = () => {
      reject(xhr.response)
  }
  xhr.send()  
  })
}

//Let`s get thumbnails for gallery
async function thumbRequest(method, url) {
return new Promise ((resolve, reject) => {

  const xhr = new XMLHttpRequest()

  xhr.open(method, url, true)
  xhr.responseType = 'json'
  xhr.onload = () => {
    if (xhr.status >= 400) {
      reject(xhr.response)
    } else {
      resolve(xhr.response)
      let images = JSON.parse(xhr.response.images)
      images.reverse().forEach((item, index) => {
        let img = new Image();
        img.src = item.img;
        pic = document.querySelectorAll('.thumbnail' + (index + 1))[0];
        pic.appendChild(img)
        img.setAttribute('id', 'thumb')
      });
    }
  }
  xhr.onerror = () => {
    reject(xhr.response)
}
xhr.send()  
})
}

//Let`s get image for mini card from server
async function miniCardImgRequest(method, url) {
  return new Promise ((resolve, reject) => {
  
    const xhr = new XMLHttpRequest()
  
    xhr.open(method, url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response)
        let images = JSON.parse(xhr.response.images)
        images.reverse()
        images.length = 1
        images.forEach((item, index) => {
          let img = new Image()
          img.src = item.img
          pic = document.querySelector('.mini_card_image')
          pic.appendChild(img)
        });
      }
    }
    xhr.onerror = () => {
      reject(xhr.response)
  }
    xhr.send()  
  })
}

//Let`s get quantity form server
async function quantity(method, url) {
  return new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response.quantity)
      }
    }
    xhr.onerror = () => {
      reject(xhr.response)
  }
    xhr.send()  
  })
}

//Start our requests
sendRequest('GET', requestUrl)
imgRequest('GET', requestUrl)
thumbRequest('GET', requestUrl)
miniCardImgRequest('GET', requestUrl)

//Let`s make something like gallery
setTimeout(() => {
  let largeImg = document.getElementById('largeImg') // Findin` main image container
  let thumbs = document.querySelectorAll('#thumb')  // Findin` thumbnails containers
  let thumbnails = []   // Putting containers in array
  thumbs.forEach((node) => {
    thumbnails.push(node) 
  })

  //Replacing images from thumbnails container to main image container
  thumbnails.forEach(item => {
    item.addEventListener('click', () => {
      let temp = item.src
      largeImg.src = item.src
    })
  })
}, 1000);

// Modal window for gallery
setTimeout(() => {
  var modal = document.getElementById('modal');
  var img = document.getElementById('largeImg');
  var modalImg = document.getElementById("img01");
  img.onclick = function(){
      modal.style.display = "block";
      modalImg.src = this.src;
  }

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() { 
      modal.style.display = "none";
  }
}, 1000);

//Let's count quantity of items for cart adding 
quantity('GET', requestUrl)
setTimeout(() => {
  const btns = document.querySelectorAll(".counter_btn")

  btns.forEach(btn => {
    btn.addEventListener('click',
      function (){
        const direction = this.dataset.direction
        const inp = this.parentElement.querySelector('.counter_value')
        const currentValue = +inp.value
        let newValue
    
        if (direction === 'plus') {
          if (inp.value < document.getElementById('quantity').textContent){
            newValue = currentValue + 1
          } else {      ///Showing alert
            const maxQuantity = document.createElement('div')
            maxQuantity.setAttribute('class', 'max_quantity')
            maxQuantity.textContent = 'Maximum number of items added'
            document.getElementById('main').appendChild(maxQuantity)
            newValue = currentValue
          }
        } else {
          newValue = currentValue - 1 > 0 ? currentValue - 1 : 0
        }
    
        inp.value = newValue
    })
  })  
}, 1000);

//Let's show the user adding an item to the cart
setTimeout(() => {
  const buyBtn = document.querySelectorAll('.buy')
  const quantityCart = document.getElementsByClassName('counter_value')[0]
  const cartBlock = document.createElement('a')
  cartBlock.setAttribute('class', 'cart_block')
  const cartItems = document.getElementsByClassName('basket_badge')[0]
  
  buyBtn.forEach(button => {
    button.addEventListener('click', function() {
      const mainBlock = document.getElementById('main')
      if(!mainBlock.contains(cartBlock)){   // Alerting about added items
        cartBlock.textContent = 'Items: '
        mainBlock.appendChild(cartBlock)
        if(quantityCart.value == 0) {
          cartBlock.textContent = 'Items: ' + 1
          cartItems.textContent = 1
        } else {
          cartBlock.textContent = 'Items: ' + quantityCart.value
          cartItems.textContent = quantityCart.value
        }
      } else {
        mainBlock.removeChild(cartBlock)
      }
      if (button.classList.contains('buy')) {  // Making button 'clicked' 
        button.classList.add('success')
        button.classList.remove('buy')
      } else {
        button.classList.remove('success')
        button.classList.add('buy')
      }
      return true
    })
  })  
}, 1000);