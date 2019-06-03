-- All active boats
SELECT DISTINCT boat_id, name 
FROM presences JOIN boats ON boats.id = presences.boat_id 
WHERE date >= DATE_SUB(NOW(), INTERVAL 6 MONTH);