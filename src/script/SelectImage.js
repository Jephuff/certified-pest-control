var SelectImage = createClass({
  handleChange: function(e) {
    this.props.onChange(e.target.value);
  },
  render: function() {
    var value = this.props.value || "";
    var field = this.props.field;
    var fieldOptions = field.get("options").toJS();

    var options = (field.get("default", false)
      ? []
      : [{ label: "", value: "" }]
    ).concat(
      fieldOptions.map(function(option) {
        if (typeof option === "string") {
          return { label: option, value: option };
        }
        return Immutable.Map.isMap(option) ? option.toJS() : option;
      })
    );
    return h("div", { style: { display: "flex" } }, [
      h(
        "select",
        { id: this.props.forID, value: value, onChange: this.handleChange },
        options.map(function(option, idx) {
          return h("option", { key: idx, value: option.value }, [option.label]);
        })
      ),
      h("img", { src: "/" + value, style: { height: 50 } })
    ]);
  }
});

CMS.registerWidget("selectImage", SelectImage);
