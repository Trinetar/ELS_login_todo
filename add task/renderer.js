// Check if electronAPI is defined
if (typeof electronAPI !== 'undefined') {
    // Functions for interacting with the main process
    function loadTasks() {
        electronAPI.send('load-tasks');
    }

    function addTask() {
        const taskInput = document.getElementById('task-input');
        const newTask = { description: taskInput.value };
        electronAPI.send('add-task', newTask);
    }

    function removeTask(index) {
        electronAPI.send('remove-task', index);
    }

    // Listen for tasks-updated event from main process
    electronAPI.receive('tasks-updated', (event, tasks) => {
        // Update the UI with the new tasks
    });

    // Load tasks when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        loadTasks();
    });
} else {
    console.error('electronAPI is not defined. Make sure your preload script or contextBridge is set up correctly.');
}
