import { Icon } from "@/components/ui/Icon";
import { ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import { SIDE, SIDES } from "@/lib/portal";

/** The two ways in: restaurants and Nama staff. */
export function Doors() {
  return (
    <div className="mt-2 text-left">
      <ListGroup>
        {SIDES.map((s) => (
          <ListRow
            key={s}
            href={SIDE[s].login}
            leading={
              <RowIcon tone={s === "restaurant" ? "lime" : "forest"}>
                <Icon name={SIDE[s].icon} size={17} strokeWidth={2.1} />
              </RowIcon>
            }
            title={<span className="font-semibold">{SIDE[s].door}</span>}
            note={SIDE[s].doorText}
          />
        ))}
      </ListGroup>
    </div>
  );
}
