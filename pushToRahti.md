docker build --no-cache -t hki-piiroinen .
docker run -p 3000:3000 hki-piiroinen
docker run --env-file .env.local -p 3000:3000 hki-piiroinen  // env tiedoston kanssa.

Rahti 2 - Rahti Image registry
docker tag hki-piiroinen image-registry.apps.2.rahti.csc.fi/alyakokeilut/hki-piiroinen:latest
docker login -u g -p $(oc whoami -t) image-registry.apps.2.rahti.csc.fi
docker push image-registry.apps.2.rahti.csc.fi/alyakokeilut/hki-piiroinen:latest

-Tarkista imagestream
oc get imagestream
