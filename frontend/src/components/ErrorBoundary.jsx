import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: "24px 16px",
          background: "#FFF0F0",
          border: "3px solid #CC1111",
          borderRadius: "10px",
          margin: "16px",
          textAlign: "center"
        }}>
          <p style={{ color: "#CC1111", fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0" }}>
            ⚠️ Algo salió mal
          </p>
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 12px 0", wordBreak: "break-all" }}>
            {this.state.error?.message || String(this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              background: "#CC1111", color: "white", border: "none",
              borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
              fontWeight: "bold", fontSize: "13px"
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
