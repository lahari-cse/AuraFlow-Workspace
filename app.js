/* AuraFlow Task Workspace Engine */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const navbar = document.getElementById('main-nav');
    const themeBtn = document.getElementById('theme-btn');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const addTaskForm = document.getElementById('add-task-form');
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');

    // State Variables
    let currentTheme = localStorage.getItem('auraflow-theme') || 'dark';
    let tasks = [];
    let workflowChart = null;

    // Seed Data
    const seedTasks = [
        {
            id: 'task-1',
            title: 'Refine Glassmorphic Colors',
            desc: 'Polish card translucency, backdrop filters, and border colors in light & dark configurations.',
            priority: 'high',
            status: 'todo'
        },
        {
            id: 'task-2',
            title: 'Incorporate Fluid Keyframe Animations',
            desc: 'Establish background glowing blob coordinates and hover scale behaviors.',
            priority: 'medium',
            status: 'progress'
        },
        {
            id: 'task-3',
            title: 'Synchronize Storage Engines',
            desc: 'Implement persistent event binding between local state arrays and window localStorage.',
            priority: 'low',
            status: 'review'
        },
        {
            id: 'task-4',
            title: 'Implement Navigation Tracking',
            desc: 'Leverage scroll active listeners to alter header background classes automatically.',
            priority: 'high',
            status: 'completed'
        }
    ];

    // ==========================================
    // 1. Theme Configuration
    // ==========================================
    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('auraflow-theme', theme);
        currentTheme = theme;

        if (theme === 'light') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }

        // Update Chart colors if it exists
        if (workflowChart) {
            updateChartThemeColors(theme);
        }
    };

    // Initialize Theme
    applyTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    // ==========================================
    // 2. Navigation & Header UI Controllers
    // ==========================================
    // Toggle header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Mobile navigation panel toggler
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-menu-active');
    });

    // Hide mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-menu-active');
        });
    });

    // Active Section Tracking on Scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navItems.forEach(item => {
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // 3. Task Management (Kanban Logic)
    // ==========================================
    // Read Tasks or fallback to seed
    const initTasks = () => {
        const storedTasks = localStorage.getItem('auraflow-tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        } else {
            tasks = [...seedTasks];
            saveTasksToStorage();
        }
        renderTasks();
        updateStats();
        initWorkflowChart();
    };

    const saveTasksToStorage = () => {
        localStorage.setItem('auraflow-tasks', JSON.stringify(tasks));
    };

    // Render Tasks to Columns
    const renderTasks = () => {
        const cols = {
            todo: document.getElementById('list-todo'),
            progress: document.getElementById('list-progress'),
            review: document.getElementById('list-review'),
            completed: document.getElementById('list-completed')
        };

        const counts = {
            todo: document.getElementById('count-todo'),
            progress: document.getElementById('count-progress'),
            review: document.getElementById('count-review'),
            completed: document.getElementById('count-completed')
        };

        // Clear Lists
        Object.keys(cols).forEach(status => {
            cols[status].innerHTML = '';
        });

        // Track counters
        const countsTracker = { todo: 0, progress: 0, review: 0, completed: 0 };

        // Build Card DOM Elements
        tasks.forEach(task => {
            countsTracker[task.status]++;
            const card = createTaskCard(task);
            cols[task.status].appendChild(card);
        });

        // Update indicators
        Object.keys(counts).forEach(status => {
            counts[status].textContent = countsTracker[status];
        });
    };

    // Create single task card UI
    const createTaskCard = (task) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'glass-panel task-card';
        cardDiv.id = task.id;

        // Determine arrow visibility
        const isFirst = task.status === 'todo';
        const isLast = task.status === 'completed';

        let backBtn = isFirst ? '' : `<button class="task-btn move-back-btn" title="Move Back">←</button>`;
        let forwardBtn = isLast ? '' : `<button class="task-btn move-forward-btn" title="Move Forward">→</button>`;

        cardDiv.innerHTML = `
            <div class="task-header">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
            </div>
            <h4 class="task-title">${escapeHtml(task.title)}</h4>
            <p class="task-desc">${escapeHtml(task.desc || 'No description provided')}</p>
            <div class="task-footer">
                <div class="task-actions">
                    ${backBtn}
                    ${forwardBtn}
                </div>
                <button class="task-btn btn-delete" title="Delete Task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;

        // Event bindings on card elements
        const backAction = cardDiv.querySelector('.move-back-btn');
        if (backAction) {
            backAction.addEventListener('click', () => transitionTask(task.id, 'back'));
        }

        const forwardAction = cardDiv.querySelector('.move-forward-btn');
        if (forwardAction) {
            forwardAction.addEventListener('click', () => transitionTask(task.id, 'forward'));
        }

        cardDiv.querySelector('.btn-delete').addEventListener('click', () => removeTask(task.id));

        return cardDiv;
    };

    // Escape script inputs for rendering safety
    const escapeHtml = (text) => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Move task states forwards or backwards
    const transitionTask = (taskId, direction) => {
        const statuses = ['todo', 'progress', 'review', 'completed'];
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const currentIndex = statuses.indexOf(task.status);
        let newIndex = currentIndex;

        if (direction === 'forward' && currentIndex < statuses.length - 1) {
            newIndex++;
        } else if (direction === 'back' && currentIndex > 0) {
            newIndex--;
        }

        if (newIndex !== currentIndex) {
            task.status = statuses[newIndex];
            saveTasksToStorage();
            renderTasks();
            updateStats();
            updateChartData();
        }
    };

    // Remove tasks
    const removeTask = (taskId) => {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        updateChartData();
    };

    // Add Task listener
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const descInput = document.getElementById('task-desc');
        const priorityInput = document.getElementById('task-priority');

        const newTask = {
            id: 'task-' + Date.now(),
            title: titleInput.value.trim(),
            desc: descInput.value.trim(),
            priority: priorityInput.value,
            status: 'todo'
        };

        tasks.push(newTask);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        updateChartData();

        // Clear Form fields
        titleInput.value = '';
        descInput.value = '';
        priorityInput.value = 'medium';
    });

    // Update Widget Statistics values
    const updateStats = () => {
        const total = tasks.length;
        const progress = tasks.filter(t => t.status === 'progress' || t.status === 'review').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('total-tasks-count').textContent = total;
        document.getElementById('in-progress-count').textContent = progress;
        document.getElementById('completed-count').textContent = completed;
        document.getElementById('completion-rate-pct').textContent = `${rate}%`;
    };

    // ==========================================
    // 4. ChartJS Progress Analytics
    // ==========================================
    const getChartThemeColors = (theme) => {
        const isDark = theme === 'dark';
        return {
            text: isDark ? '#94a3b8' : '#475569',
            grid: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'
        };
    };

    const initWorkflowChart = () => {
        const ctx = document.getElementById('workflowChart').getContext('2d');
        const themeColors = getChartThemeColors(currentTheme);

        const statusCounts = { todo: 0, progress: 0, review: 0, completed: 0 };
        tasks.forEach(t => statusCounts[t.status]++);

        workflowChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['To Do', 'In Progress', 'Under Review', 'Completed'],
                datasets: [{
                    data: [
                        statusCounts.todo,
                        statusCounts.progress,
                        statusCounts.review,
                        statusCounts.completed
                    ],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.6)',  // Todo Accent (purple)
                        'rgba(6, 182, 212, 0.6)',   // Progress (cyan)
                        'rgba(245, 158, 11, 0.6)',  // Review (orange)
                        'rgba(16, 185, 129, 0.6)'   // Completed (green)
                    ],
                    borderColor: [
                        'rgba(139, 92, 246, 1)',
                        'rgba(6, 182, 212, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: themeColors.text,
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            padding: 20
                        }
                    }
                },
                cutout: '65%'
            }
        });
    };

    const updateChartData = () => {
        if (!workflowChart) return;
        const statusCounts = { todo: 0, progress: 0, review: 0, completed: 0 };
        tasks.forEach(t => statusCounts[t.status]++);

        workflowChart.data.datasets[0].data = [
            statusCounts.todo,
            statusCounts.progress,
            statusCounts.review,
            statusCounts.completed
        ];
        workflowChart.update();
    };

    const updateChartThemeColors = (theme) => {
        if (!workflowChart) return;
        const themeColors = getChartThemeColors(theme);
        workflowChart.options.plugins.legend.labels.color = themeColors.text;
        workflowChart.update();
    };

    // ==========================================
    // 5. Contact Form Submissions Handler
    // ==========================================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('contact-name').value.trim();
        const emailVal = document.getElementById('contact-email').value.trim();
        const msgVal = document.getElementById('contact-msg').value.trim();

        if (!nameVal || !emailVal || !msgVal) {
            showFormFeedback('Please fill in all details before submitting.', 'error');
            return;
        }

        // Simulate success submit
        showFormFeedback(`Thank you, ${nameVal}! Your feedback was received.`, 'success');
        contactForm.reset();
    });

    const showFormFeedback = (message, type) => {
        formMsg.textContent = message;
        formMsg.className = `form-feedback ${type}`;
        
        setTimeout(() => {
            formMsg.style.display = 'none';
        }, 5000);
    };

    // Initialize App States
    initTasks();
});
