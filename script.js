/*
** MATEO CABRERA's PROJECT, 2024
** script.js
** File description:
** draw points on a canvas and highlight the nearest point to the cursor
*/

function generate_random_point(width, height)
{
    const x = Math.random() * width;
    const y = Math.random() * height;

    return { x, y };
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
        const { x, y } = points[i];

        buffer_context.beginPath();
        buffer_context.arc(x, y, 1, 0, 2 * Math.PI);
        buffer_context.fill();
    }
    canvas_context.drawImage(buffer, 0, 0);
}

function find_nearest_point(cursor_x, cursor_y, points)
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

function handle_mousemove(event, points, canvas, buffer, canvas_context)
{
    const rect = canvas.getBoundingClientRect();
    const cursor_x = event.clientX - rect.left;
    const cursor_y = event.clientY - rect.top;
    const nearest_point = find_nearest_point(cursor_x, cursor_y, points);

    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_context.drawImage(buffer, 0, 0);
    canvas_context.fillStyle = 'red';
    canvas_context.beginPath();
    canvas_context.arc(nearest_point.x, nearest_point.y, 3, 0, 2 * Math.PI);
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

    draw_points(points, buffer_context, canvas_context, buffer);
    canvas.addEventListener('mousemove', (event) => handle_mousemove(event, points, canvas, buffer, canvas_context));
}

main();
