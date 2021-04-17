var canvas = $("#board")[0]; //document.getElementById("board");

var ctx = canvas.getContext('2d');

class Shape
{
  constructor(element)
  {
    this.element = element;
  }
  
  draw(){}
}

class Rectangle extends Shape
{
  constructor(element)
  {
    super(element)
  }
  
  draw()
  {
    let X = this.element.position().left;
    let Y = this.element.position().top;
    let W = this.element.width();
    let H = this.element.height();
    
    ctx.moveTo(X, Y);
    
    ctx.rect(X, Y, W, H);
  }
}

class ArcRectangle extends Shape
{
  constructor(element)
  {
    super(element)
  }
  
  draw()
  {
    let X = this.element.position().left;
    let Y = this.element.position().top;
    let W = this.element.width();
    let H = this.element.height();
    
    // Radius
    let R = (H / 2) + ((W * W) / (8 * H));
    
    let startAngle = Math.atan2((Y + R) - (Y + H), (X + (W / 2)) - X);
    
    let endAngle = Math.atan2((Y + R) - (Y + H), (X + (W / 2)) - (X + W));
    
    ctx.moveTo(X, Y + H);
    
    ctx.arc(X + (W / 2), Y + R, R, startAngle - Math.PI, endAngle - Math.PI, false);
  }
}


var container = document.querySelector("#ui");

var activeItem = null;

var active = false;

container.addEventListener("touchstart", OnDragStart, false);
container.addEventListener("touchend", OnDragEnd, false);
container.addEventListener("touchmove", OnDrag, false);

container.addEventListener("mousedown", OnDragStart, false);
container.addEventListener("mouseup", OnDragEnd, false);
container.addEventListener("mousemove", OnDrag, false);

function OnDragStart(e)
{
  if (e.target !== e.currentTarget)
  {
    active = true;

    // this is the item we are interacting with
    activeItem = e.target;

    if (activeItem !== null)
    {
      if (!activeItem.xOffset)
      
        activeItem.xOffset = 0;

      if (!activeItem.yOffset)
      
        activeItem.yOffset = 0;

      if (e.type === "touchstart")
      {
        activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
        activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
      }
      else
      {
        activeItem.initialX = e.clientX - activeItem.xOffset;
        activeItem.initialY = e.clientY - activeItem.yOffset;
      }
    }
  }
}

function OnDragEnd(e)
{
  if (activeItem !== null)
  {
    activeItem.initialX = activeItem.currentX;
    activeItem.initialY = activeItem.currentY;
  }

  active = false;
  activeItem = null;
}

function OnDrag(e)
{
  if (active)
  {
    if (e.type === "touchmove")
    {
      e.preventDefault();

      activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
      activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
    }
    else
    {
      activeItem.currentX = e.clientX - activeItem.initialX;
      activeItem.currentY = e.clientY - activeItem.initialY;
    }

    activeItem.xOffset = activeItem.currentX;
    activeItem.yOffset = activeItem.currentY;
    
    activeItem.style.transform = "translate3d(" + activeItem.currentX + "px, " + activeItem.currentY + "px, 0)";
    
    Repaint();
  }
}

var shapes = [];

var $ui = $("#ui");

function AddRectangle(x, y, width, height)
{
  let $element = $("<div>", { class: "shape", width:`${width}`, height:`${height}`});
  
  let rectangle = new Rectangle($element);
  
  shapes.push(rectangle);
  
  $ui.append($element);
  
  Repaint();
}

function AddArcRectangle(x, y, width, height)
{
  let $element = $("<div>", { class: "shape", width: `${width}`, height: `${height}` });

  let arcRectangle = new ArcRectangle($element);

  shapes.push(arcRectangle);

  $ui.append($element);

  Repaint();
}

AddRectangle(15, 15, 200, 75);

AddArcRectangle(15, 15, 200, 75);

function Repaint()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = 'rgb(255,255,255)';
  
  ctx.beginPath();
  
  shapes.forEach( shape => shape.draw() );
  
  ctx.stroke();
}
