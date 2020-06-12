function embedquoteback(){




	// THIS DOESN'T WORK. customElements.get('quoteback-component')
	// returns undefined even if page has embeds on and has customelement defined
  if (customElements.get('quoteback-component')){
		console.log("quoteback-component already defined");
		null;
  }else{
			console.log("about to define quoteback-component");
      window.customElements.define('quoteback-component', QuoteBack)  
	}
}	