ALTER TABLE ways ADD COLUMN component integer;
-- SELECT pgr_connectedComponents(
--     'SELECT gid AS id, source, target, cost, reverse_cost FROM ways'
-- );

UPDATE ways w
SET component = c.component
FROM (
    SELECT node, component
    FROM pgr_connectedComponents(
        'SELECT gid AS id, source, target, cost, reverse_cost FROM ways'
    )
) AS c
WHERE w.source = c.node;