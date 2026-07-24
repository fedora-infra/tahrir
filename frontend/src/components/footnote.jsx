import { Col, Container, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function FootNote() {
  const load = useSelector((area) => area.area.load);
  if (load) {
    return null;
  }

  return (
    <Container>
      <footer className="border-top py-2">
        <Row className="align-items-center">
          <Col className="col-lg-3 d-flex align-items-center">
            <a
              href="https://www.redhat.com/"
              className="text-decoration-none d-inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="d-inline-block position-relative me-auto rh-logo">
                <Image
                  src="https://fedoraproject.org/assets/images/logo-sponsored-by-red-hat.png"
                  height="40"
                  className="d-block me-auto"
                />
              </span>
            </a>
          </Col>
          <Col className="col-lg-9 text-end small text-muted">
            <div>Fedora is sponsored by Red Hat. © {new Date().getFullYear()} Red Hat, Inc. and others</div>
            <div>
              <a
                href="https://www.redhat.com/en/topics/linux/fedora-vs-red-hat-enterprise-linux"
                className="text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about the relationship between Red Hat and Fedora
              </a>
            </div>
          </Col>
        </Row>
      </footer>
    </Container>
  );
}
