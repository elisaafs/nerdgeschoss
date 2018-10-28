import { Link, LinkGroup } from "../types/links";

function linkTimeComparator(a: Link, b: Link) {
  const aTimestamp = new Date(a.created_at).getTime();
  const bTimestamp = new Date(b.created_at).getTime();
  return bTimestamp - aTimestamp;
}

function likeCountComparator(a: Link, b: Link) {
  return b.like_count - a.like_count;
}

export function organizeByDays(links: Link[]): LinkGroup[] {
  const linkSortedByCreation = links.sort(linkTimeComparator);

  let groups: LinkGroup[] = [];
  let currentGroup: LinkGroup;

  linkSortedByCreation.forEach(link => {
    const day = new Date(link.created_at).toDateString();
    if (!currentGroup || currentGroup.day !== day) {
      currentGroup = {
        day,
        links: []
      };
      groups.push(currentGroup);
    }

    currentGroup.links.push(link);
  });

  return groups.map(group => ({
    day: group.day,
    links: group.links.sort(likeCountComparator)
  }));
}
