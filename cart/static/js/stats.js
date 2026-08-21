/* =========================
   NUMBER COUNTER
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const counters =
        document.querySelectorAll(".counter");

    const statsSection =
        document.querySelector(".stats-section");


    /* Make sure the section exists */

    if (!statsSection || counters.length === 0) {
        return;
    }


    /* =========================
       OBSERVER
    ========================= */

    const observer = new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    counters.forEach(function (counter) {

                        const target =
                            Number(
                                counter.getAttribute(
                                    "data-target"
                                )
                            );


                        const duration = 1800;

                        const startTime =
                            performance.now();


                        /* =========================
                           ANIMATE NUMBER
                        ========================= */

                        function updateCounter(currentTime) {

                            const elapsed =
                                currentTime - startTime;


                            const progress =
                                Math.min(
                                    elapsed / duration,
                                    1
                                );


                            /* Ease-out */

                            const easedProgress =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );


                            const current =
                                Math.floor(
                                    easedProgress * target
                                );


                            counter.textContent =
                                current;


                            /* Continue animation */

                            if (progress < 1) {

                                requestAnimationFrame(
                                    updateCounter
                                );

                            } else {

                                /* Final number */

                                counter.textContent =
                                    target;

                            }

                        }


                        requestAnimationFrame(
                            updateCounter
                        );

                    });


                    /*
                     * Stop observing.
                     *
                     * This means the counter
                     * runs only once.
                     */

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.35
        }

    );


    /* =========================
       START OBSERVER
    ========================= */

    observer.observe(statsSection);

});