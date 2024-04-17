/*
** MATEO CABRERA's PROJECT, 2024
** script.js
** File description:
** draw points on a canvas and highlight the nearest point to the cursor
*/

const url_params = new URLSearchParams(window.location.search);
const num_points = url_params.get('point_amount');

const canvas = document.getElementById('myCanvas');
const canvas_context = canvas.getContext('2d');

const points = [];

function generate_random_point()
{
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    return { x, y };
}

for (let i = 0; i < num_points; i++)
    points.push(generate_random_point());

function draw_points()
{
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_context.fillStyle = 'black';
    for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i];
        canvas_context.beginPath();
        canvas_context.arc(x, y, 1, 0, 2 * Math.PI);
        canvas_context.fill();
    }
}

function find_nearest_point(cursor_x, cursor_y)
{
    let min_distance = Infinity;
    let nearest_point = null;

    for (let i = 0; i < points.length; i++) {
        const { x, y } = points[i];
        const distance = Math.hypot(x - cursor_x, y - cursor_y);
        if (distance < min_distance) {
            min_distance = distance;
            nearest_point = points[i];
        }
    }
    return nearest_point;
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const cursor_x = event.clientX - rect.left;
    const cursor_y = event.clientY - rect.top;
    const nearest_point = find_nearest_point(cursor_x, cursor_y);

    draw_points();
    canvas_context.fillStyle = 'red';
    canvas_context.beginPath();
    canvas_context.arc(nearest_point.x, nearest_point.y, 3, 0, 2 * Math.PI);
    canvas_context.fill();
});

draw_points();
