import json
import urllib

import pyquil.quil as pq
import pyquil.api as api
from pyquil.gates import *
import numpy as np

qvm = api.SyncConnection()

from flask import Flask, request, redirect, url_for, render_template, jsonify
app = Flask(__name__)

p = pq.Program()

def orcl(n, bst):
    q = pq.Program()
    N=2**n
    gate = np.identity(N)
    gate[bst][bst] = -1.0
    q.defgate("oracle", gate)
    oc = "oracle"
    for i in range(n):
        oc+=" "+str(i)
    return q.inst(oc)


def diff(n,N):
    q = pq.Program()
    diff_gate = np.full((N, N), 2.0/N)
    for i in range(N):
        diff_gate[i][i] -= 1
    q.defgate("diffop", diff_gate)
    dc = "diffop"
    for i in range(n):
        dc+=" "+str(i)
    return q.inst(dc)

def newop(n):
    q=pq.Program()
    cmd=""
    for i in range(n):
        cmd=cmd+"H "+str(i)+"\n"
    return q.inst(cmd)

@app.route('/', methods = ['POST', 'GET'])
def home():
    if request.method == 'POST':
        jsdata = request.get_json()
        if(jsdata['type']==0):
            num = jsdata['n']
            p = newop(int(num))
            wvf, _ = qvm.wavefunction(p)
            prob = wvf.get_outcome_probs()
            print prob
            return jsonify(prob)
        elif(jsdata['type']==1):
            string = jsdata['bits']
            bit_string = int(string, 2)
            n = int(jsdata['numq'])
            global p
            p+=orcl(n, bit_string)
            p+=diff(n, 2**n)
            print p

            wvf, _ = qvm.wavefunction(p)
            prob = wvf.get_outcome_probs()
            print prob
            return jsonify(prob)
        elif(jsdata['type']==2):
            global p
            while(p.pop()):
                p.pop()

    return render_template('index.html')

if __name__ == "__main__":
	app.run()
