/*
** MATEO CABRERA's PROJECT, 2024
** script.js
** File description:
** draw points on a canvas and highlight the nearest point to the cursor
*/

class Cell {
    constructor() {
        this.points = [];
    }
}

function generate_random_point(width, height)
{
    const x = Math.random() * width;
    const y = Math.random() * height;

    return [x, y];
}

function generate_points(num_points, width, height)
{
    const points = [];

    for (let i = 0; i < num_points; i++)
        points.push(generate_random_point(width, height));
    return points;
}

function draw_points(points, buffer_context, canvas_context, buffer)
{
    buffer_context.fillStyle = 'black';
    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];

        buffer_context.beginPath();
        buffer_context.arc(x, y, 1, 0, 2 * Math.PI);
        buffer_context.fill();
    }
    canvas_context.drawImage(buffer, 0, 0);
}

function create_grid(points, width, height, num_cells)
{
    const grid = [];
    const cell_size = Math.max(width, height) / num_cells;

    for (let i = 0; i < num_cells; i++) {
        grid[i] = [];
        for (let j = 0; j < num_cells; j++) {
            grid[i][j] = new Cell();
        }
    }
    for (let point of points) {
        const [x, y] = point;
        const cell_x = Math.floor(x / cell_size);
        const cell_y = Math.floor(y / cell_size);

        grid[cell_x][cell_y].points.push(point);
    }
    return { grid, cell_size };
}

function get_cell_coordinates(point, cell_size)
{
    const [x, y] = point;
    const cell_x = Math.floor(x / cell_size);
    const cell_y = Math.floor(y / cell_size);

    return [cell_x, cell_y];
}

function get_surrounding_cells(grid, cell_x, cell_y)
{
    const cells = [];

    for (let i = Math.max(0, cell_x - 1); i <= Math.min(grid.length - 1, cell_x + 1); i++) {
        for (let j = Math.max(0, cell_y - 1); j <= Math.min(grid[i].length - 1, cell_y + 1); j++) {
            cells.push(grid[i][j]);
        }
    }
    return cells;
}

function find_nearest_point_in_cells(cells, point)
{
    let nearest_point = null;
    let nearest_distance = Infinity;

    for (let cell of cells) {
        for (let cell_point of cell.points) {
            const distance = distance_sq(cell_point, point);

            if (distance < nearest_distance) {
                nearest_distance = distance;
                nearest_point = cell_point;
            }
        }
    }
    return nearest_point;
}

function find_nearest_point(grid, cell_size, point)
{
    const [cell_x, cell_y] = get_cell_coordinates(point, cell_size);
    const cells = get_surrounding_cells(grid, cell_x, cell_y);
    const nearest_point = find_nearest_point_in_cells(cells, point);

    return nearest_point;
}

function distance_sq(pointA, pointB)
{
    const dx = pointA[0] - pointB[0];
    const dy = pointA[1] - pointB[1];

    return dx * dx + dy * dy;
}

function handle_mousemove(event, canvas, buffer, canvas_context, grid, cell_size)
{
    const rect = canvas.getBoundingClientRect();
    const cursor_x = event.clientX - rect.left;
    const cursor_y = event.clientY - rect.top;
    const nearest_point = find_nearest_point(grid, cell_size, [cursor_x, cursor_y]);

    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_context.drawImage(buffer, 0, 0);
    canvas_context.fillStyle = 'red';
    canvas_context.beginPath();
    canvas_context.arc(nearest_point[0], nearest_point[1], 3, 0, 2 * Math.PI);
    canvas_context.fill();
}

function main()
{
    const url_params = new URLSearchParams(window.location.search);
    const num_points = url_params.get('point_amount');
    const canvas = document.getElementById('myCanvas');
    const canvas_context = canvas.getContext('2d');
    const buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    const buffer_context = buffer.getContext('2d');
    const points = generate_points(num_points, canvas.width, canvas.height);
    const { grid, cell_size } = create_grid(points, canvas.width, canvas.height, num_points / 10000);

    draw_points(points, buffer_context, canvas_context, buffer);
    canvas.addEventListener('mousemove', (event) => handle_mousemove(event, canvas, buffer, canvas_context, grid, cell_size));
}

main();
