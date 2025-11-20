FROM ocaml/opam:debian-13-ocaml-5.5

USER root
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libev-dev \
    libssl-dev \
    libpthread-stubs0-dev \
    m4 \
    && rm -rf /var/lib/apt/lists/*

USER opam

RUN eval $(opam env) && opam install dune utop angstrom lwt --yes

ENTRYPOINT ["opam", "exec", "--"]
CMD ["bash"]