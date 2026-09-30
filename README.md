
cache cleanup

All:
curl -X POST "https://hvyt.pl/api/cache/flush?env=staging&flushAll=true"
curl -X POST "https://hvyt.pl/api/cache/flush?env=prod&flushAll=true"

Custom key:
curl -X POST "https://hvyt.pl/api/cache/flush?env=staging&key=fetchKolekcjePostsWithImages_pl"