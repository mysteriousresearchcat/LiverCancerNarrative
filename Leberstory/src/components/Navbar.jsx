import React, { useEffect, useMemo } from "react";
import { navLinksByVersion, sectionGroupsByVersion } from "../../constants";

const Navbar = ({ version = "A" }) => {
  const sectionGroups =
    sectionGroupsByVersion[version] || sectionGroupsByVersion.A;

  const navLinks =
    navLinksByVersion[version] || navLinksByVersion.A;

  const allSectionIds = useMemo(() => {
    return ["hero", ...Object.values(sectionGroups).flat(), "sectionfuenfzehn"];
  }, [sectionGroups]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const activate = (id) => {
      document.querySelectorAll("nav a").forEach((link) => {
        link.classList.toggle("active", link.dataset.link === id);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.id;

        let found = false;
        for (const [navId, sections] of Object.entries(sectionGroups)) {
          if (sections.includes(sectionId)) {
            activate(navId);
            found = true;
            break;
          }
        }

        if (!found) activate(null);
      });
    }, observerOptions);

    allSectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [allSectionIds, sectionGroups]);

  return (
    <nav>
      <div className="flex items-center justify-between w-full gap-2">
        <ul className="flex flex-1 min-w-0 gap-3 overflow-x-auto whitespace-nowrap">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                data-link={link.id}
                className="px-2 py-0.5"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
