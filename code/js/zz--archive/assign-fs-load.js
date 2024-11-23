// Assign FS Load More to CMS collection list
// Not needed if it's the only list on the page

// Wait for the window to load and a short delay to ensure all scripts are initialized
window.addEventListener("load", function () {
  setTimeout(function () {
    // Array of configurations for each project list
    const projectConfigs = [
      {
        listId: "#project-list-1",
        loadMoreId: "#project-load-1",
        paginationId: "#project-pagination-1",
      },
      {
        listId: "#project-list-2",
        loadMoreId: "#project-load-2",
        paginationId: "#project-pagination-2",
      },
    ];

    // Initialize FsLibrary for each project list
    projectConfigs.forEach((config) => {
      if (document.querySelector(config.listId)) {
        const loadMoreProjects = new FsLibrary({
          collections: [
            {
              list: config.listId, // Target the project list by ID
              loadMore: config.loadMoreId, // Target the load more button by ID
              pagination: config.paginationId, // Target the pagination by ID
              template: ".project-list-item", // Assuming the template remains the same for all
            },
          ],
        });

        loadMoreProjects.init(); // Initialize FsLibrary for the current project list
      }
    });
  }, 1000); // 1 second delay
});
