class Snake {
  constructor(
    initialPosition = [[5, 5]],
    initialFood = [10, 10],
    gridSize = 20
  ) {
    this.body = [...initialPosition];
    this.food = initialFood;
    this.gridSize = gridSize; // Grid size for boundary wrapping
  }

  /**
   * Set the snake's direction, preventing immediate reversal.
   */
  setDirection(newDirection) {
    const oppositeDirections = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    // Only allow changing direction if it's not the opposite direction
    if (newDirection !== oppositeDirections[this.direction]) {
      this.direction = newDirection;
    }
  }

  /**
   * Move the snake and handle food collision.
   */
  move() {
    const head = this.body[0];
    let newHead;

    switch (this.direction) {
      case "UP":
        newHead = [head[0], (head[1] - 1 + this.gridSize) % this.gridSize];
        break;
      case "DOWN":
        newHead = [head[0], (head[1] + 1) % this.gridSize];
        break;
      case "LEFT":
        newHead = [(head[0] - 1 + this.gridSize) % this.gridSize, head[1]];
        break;
      case "RIGHT":
        newHead = [(head[0] + 1) % this.gridSize, head[1]];
        break;
      default:
        return false;
    }

    this.body.unshift(newHead); // Add new head to the snake
    this.body.pop(); // Remove the tail
    return this.didEatFood(newHead);
  }

  /**
   * Check if the snake eats food.
   */
  didEatFood(newHead) {
    return newHead[0] === this.food[0] && newHead[1] === this.food[1];
  }

  /**
   * Grow the snake.
   */
  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push([...tail]);
  }

  /**
   * Check if the snake has collided with itself.
   */
  hasCollided() {
    const [head, ...rest] = this.body;
    return rest.some(
      (segment) => segment[0] === head[0] && segment[1] === head[1]
    );
  }
}

export default Snake;
