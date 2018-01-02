function Kalman() {
	this.G  = 1; // filter gain
	this.Rw = 1; // noise power desirable
	this.Rv = 10; // noise power estimated
	
	this.A = 1;
	this.C = 1;
	this.B = 0;
	this.u = 0;
	this.P = NaN;
	this.x = NaN; // estimated signal without noise
	this.y = NaN; //measured
		

	this.onFilteringKalman = function(ech)//signal: signal measured
	{
		this.y = ech;
		
		if (isNaN(this.x)) {
			this.x = 1/this.C * this.y;
			this.P = 1/this.C * this.Rv * 1/this.C;
		} 
		else {
			// Kalman Filter: Prediction and covariance P
			this.x = this.A*this.x + this.B*this.u;
			this.P = this.A * this.P * this.A + this.Rw;
			// Gain
			this.G = this.P*this.C*1/(this.C*this.P*this.C+this.Rv);
			// Correction
			this.x = this.x + this.G*(this.y-this.C*this.x);
			this.P = this.P - this.G*this.C*this.P;
		};
		return this.x;
	};	
	
	this.setRv = function(Rv)//signal: signal measured
	{
		this.Rv = Rv;
	};
};

function addPoint() {
    var pointsDiv = document.getElementById("points");
    var pointsString = localStorage.getItem("points");
    var points = pointsString ? parseInt(pointsString) + 1 : 0;
    pointsDiv.innerHTML = points;
    localStorage.setItem("points", points);
}

// window.applicationCache.addEventListener('updateready', function(e) {
//     window.applicationCache.swapCache();
//     window.location.reload();
// })

// window.applicationCache.update();

window.addEventListener("load", function() {

    var kalman = new Kalman();

    var appDiv = document.getElementById("app");

    var isStepping = false;

    var computeNorm = function(x,y,z) {
		var norm = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		var norm_filt = kalman.onFilteringKalman(norm);
		return norm_filt/9.80665;
	}; 

    window.addEventListener("devicemotion", function( event ) {
        if (isStepping) return;
        norm = computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
        if (norm > 1.5) {
            isStepping = true;
            appDiv.classList.add("iswalking");
            addPoint();
            setTimeout(() => {
                setTimeout(() => {
                    if (!isStepping) appDiv.classList.remove("iswalking");
                }, 10000);
                isStepping = false;
            }, 150);
        } 
    });

    //window.setInterval(addPoint, 1000);
    //addPoint();

});
