// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
  // Register ChartJS plugins
  Chart.register(
    ChartJS.CategoryScale,
    ChartJS.LinearScale,
    ChartJS.PointElement,
    ChartJS.LineElement,
    ChartJS.BarElement,
    ChartJS.Title,
    ChartJS.Tooltip,
    ChartJS.Legend,
    ChartJS.ArcElement,
    ChartJS.RadialLinearScale
  );

  // Chart Colors
  const colors = {
    primary: '#6C5CE7',
    secondary: '#FF6B6B',
    accent1: '#4ECDC4',
    accent2: '#FFD93D',
    accent3: '#95A5A6',
    background: 'rgba(255, 255, 255, 0.1)'
  };

  // Common Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Risk Score Circular Progress
  const riskScore = 65;
  const riskMeter = document.querySelector('.risk-meter .circular-progress');
  if (riskMeter) {
    riskMeter.style.setProperty('--percentage', riskScore);
    riskMeter.style.setProperty('--color', riskScore > 70 ? '#FF6B6B' : riskScore > 30 ? '#FFD93D' : '#4ECDC4');
    
    const scoreElement = riskMeter.querySelector('.score');
    if (scoreElement) {
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore >= riskScore) {
          clearInterval(interval);
        } else {
          currentScore++;
          scoreElement.textContent = currentScore + '%';
        }
      }, 20);
    }
  }

  // Risk Progression Timeline
  const riskProgressionCtx = document.getElementById('riskProgressionChart');
  if (riskProgressionCtx) {
    new Chart(riskProgressionCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Risk Score Trend',
          data: [75, 68, 62, 55, 50, 45],
          borderColor: colors.secondary,
          backgroundColor: `${colors.secondary}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Risk Breakdown Doughnut
  const riskBreakdownCtx = document.getElementById('riskBreakdownChart');
  if (riskBreakdownCtx) {
    new Chart(riskBreakdownCtx, {
      type: 'doughnut',
      data: {
        labels: ['BMI', 'Blood Pressure', 'Cholesterol', 'Smoking', 'Family History'],
        datasets: [{
          data: [25, 20, 15, 25, 15],
          backgroundColor: [
            colors.accent1,
            colors.accent2,
            colors.secondary,
            colors.accent3,
            colors.primary
          ],
          borderWidth: 2
        }]
      },
      options: {
        ...commonOptions,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  // Activity Level Bar Chart
  const activityCtx = document.getElementById('activityChart');
  if (activityCtx) {
    new Chart(activityCtx, {
      type: 'bar',
      data: {
        labels: ['Walking', 'Running', 'Cycling', 'Swimming'],
        datasets: [{
          label: 'Activity Level',
          data: [30, 20, 25, 25],
          backgroundColor: colors.primary,
          borderColor: colors.accent1,
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            max: 50
          }
        }
      }
    });
  }

  // Fitness Components Polar Chart
  const fitnessCtx = document.getElementById('fitnessChart');
  if (fitnessCtx) {
    new Chart(fitnessCtx, {
      type: 'polarArea',
      data: {
        labels: ['Cardio', 'Strength', 'Flexibility', 'Balance'],
        datasets: [{
          data: [65, 59, 80, 81],
          backgroundColor: [
            colors.secondary,
            colors.primary,
            colors.accent2,
            colors.accent1
          ]
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  // Hydration Bubble Chart
  const hydrationCtx = document.getElementById('hydrationChart');
  if (hydrationCtx) {
    new Chart(hydrationCtx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Hydration Levels',
          data: [
            { x: 1, y: 5, r: 10 },
            { x: 2, y: 6, r: 15 },
            { x: 3, y: 7, r: 8 },
            { x: 4, y: 8, r: 12 },
            { x: 5, y: 9, r: 10 }
          ],
          backgroundColor: `${colors.primary}80`
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: {
            beginAtZero: true,
            max: 6,
            title: {
              display: true,
              text: 'Time of Day'
            }
          },
          y: {
            beginAtZero: true,
            max: 10,
            title: {
              display: true,
              text: 'Hydration Level'
            }
          }
        }
      }
    });
  }

  // Add card hover animations
  const cards = document.querySelectorAll('.dashboard-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '3px 3px 0px 0px var(--border-color)';
    });
  });

  // Add smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add responsive menu toggle
  const menuToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Add window resize handler for chart responsiveness
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Chart.instances.forEach(chart => {
        chart.resize();
      });
    }, 250);
  });
});